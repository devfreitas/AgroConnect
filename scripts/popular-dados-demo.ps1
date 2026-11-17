<#
.SYNOPSIS
  Cria dados de demonstração na conta indicada, usando a API do Render.

.DESCRIPTION
  Entra com e-mail e senha de uma conta que já existe (por exemplo, a criada pelo cadastro do app) e
  cadastra, pelas rotas da própria API: 1 propriedade, 2 talhões, 1 plantio, 2 dispositivos
  (um online e um offline), 5 sensores, 24 horas de leituras, 2 leituras com problema e 1 alerta.
  Os horários são calculados a partir de agora. Nada aqui entra no app: os dados vão para o banco
  e o app só os consome pela API, como em produção.

  Rode de novo para renovar os horários (cria um novo conjunto, com códigos de dispositivo novos).

.EXAMPLE
  .\scripts\popular-dados-demo.ps1 -Email voce@exemplo.com
#>
param(
  [Parameter(Mandatory = $true)][string]$Email,
  [string]$BaseUrl = 'https://terrabyte-m1et.onrender.com/api/v1'
)

$ErrorActionPreference = 'Stop'
$securePassword = Read-Host 'Senha da conta' -AsSecureString
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

$script:token = $null

function Send-Api {
  param([string]$Method, [string]$Path, $Body)

  $headers = @{ Accept = 'application/json' }
  if ($script:token) { $headers['Authorization'] = "Bearer $($script:token)" }

  $arguments = @{
    Method      = $Method
    Uri         = "$BaseUrl$Path"
    Headers     = $headers
    TimeoutSec  = 120
    ContentType = 'application/json; charset=utf-8'
  }
  if ($null -ne $Body) {
    $json = $Body | ConvertTo-Json -Depth 6 -Compress
    $arguments['Body'] = [System.Text.Encoding]::UTF8.GetBytes($json)
  }

  try {
    return Invoke-RestMethod @arguments
  }
  catch {
    $detail = ''
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $detail = $_.ErrorDetails.Message }
    throw "Falha em $Method $Path`n$detail"
  }
}

function Format-Time([datetime]$value) {
  return $value.ToUniversalTime().ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'", [System.Globalization.CultureInfo]::InvariantCulture)
}

Write-Host 'Entrando (a primeira chamada pode levar cerca de 1 minuto se o Render estiver hibernando)...'
$auth = Send-Api -Method 'POST' -Path '/auth/login' -Body @{ email = $Email; password = $password }
$script:token = $auth.accessToken
Write-Host "Conta: $($auth.user.name) <$($auth.user.email)>"

# Margem de 2 minutos para a API nunca ver um horário "no futuro" por diferença de relógio.
$now = (Get-Date).ToUniversalTime().AddMinutes(-2)
$suffix = (Get-Date).ToString('MMddHHmm')

Write-Host 'Criando propriedade, talhões e plantio...'
$property = Send-Api 'POST' '/properties' @{
  name = 'Sítio Boa Esperança'; city = 'Ibiúna'; state = 'SP'; areaHectares = 3.5
  description = 'Propriedade de demonstração com dados simulados.'
}
$fieldA = Send-Api 'POST' "/properties/$($property.id)/fields" @{ name = 'Talhão A - Hortaliças'; areaHectares = 1.2 }
$fieldB = Send-Api 'POST' "/properties/$($property.id)/fields" @{ name = 'Talhão B - Teste'; areaHectares = 0.8 }
Send-Api 'POST' "/fields/$($fieldA.id)/plantings" @{
  cropName = 'Alface'; plantedAt = (Format-Time $now.AddDays(-18)); stage = 'VEGETATIVE'
} | Out-Null

Write-Host 'Criando dispositivos e sensores...'
$online = Send-Api 'POST' '/devices' @{
  fieldId = $fieldA.id; code = "ESP32-A$suffix"; name = 'Sensor do Canteiro de Alface'
  lastSeenAt = (Format-Time $now); rssi = -61; firmwareVersion = '1.0.0'; transport = 'WIFI'; simulatedData = $true
}
$offline = Send-Api 'POST' '/devices' @{
  fieldId = $fieldB.id; code = "ESP32-B$suffix"; name = 'Estação de monitoramento offline'
  lastSeenAt = (Format-Time $now.AddHours(-3)); firmwareVersion = '1.0.0'; transport = 'WIFI'; simulatedData = $true
}

$definitions = @(
  @{ type = 'SOIL_MOISTURE';     label = 'Umidade do solo';   unit = '%';   base = 24.5;  swing = 2.0 },
  @{ type = 'AIR_TEMPERATURE';   label = 'Temperatura do ar'; unit = '°C';  base = 26.2;  swing = 1.0 },
  @{ type = 'AIR_HUMIDITY';      label = 'Umidade do ar';     unit = '%';   base = 63.0;  swing = 1.0 },
  @{ type = 'LIGHT_ILLUMINANCE'; label = 'Luminosidade';      unit = 'lux'; base = 12500; swing = 1.0 }
)

$sensors = @()
foreach ($definition in $definitions) {
  $sensors += Send-Api 'POST' '/sensors' @{
    deviceId = $online.id; type = $definition.type; label = $definition.label; unit = $definition.unit; calibrated = $true
  }
}
$offlineSensor = Send-Api 'POST' '/sensors' @{
  deviceId = $offline.id; type = 'SOIL_MOISTURE'; label = 'Umidade do solo'; unit = '%'; calibrated = $true
}

Write-Host 'Criando 24 horas de leituras (96 envios, leva um pouco)...'
for ($index = 0; $index -lt $definitions.Count; $index++) {
  $definition = $definitions[$index]
  for ($hour = 0; $hour -lt 24; $hour++) {
    $variation = [math]::Sin($hour / 3.0) * $definition.swing
    $value = [math]::Round($definition.base + $variation, 3)
    $recordedAt = $now.AddHours($hour - 23)
    Send-Api 'POST' '/readings' @{
      sensorId = $sensors[$index].id; value = $value; quality = 'VALID'
      recordedAt = (Format-Time $recordedAt); simulatedData = $true; origin = 'SIMULATED'
    } | Out-Null
  }
  Write-Host "  $($definition.label): ok"
}

Send-Api 'POST' '/readings' @{
  sensorId = $offlineSensor.id; value = $null; quality = 'SENSOR_ERROR'
  recordedAt = (Format-Time $now.AddHours(-3)); simulatedData = $true; origin = 'SIMULATED'
  observations = 'Falha simulada do sensor.'
} | Out-Null
Send-Api 'POST' '/readings' @{
  sensorId = $sensors[0].id; value = $null; quality = 'UNCALIBRATED'
  recordedAt = (Format-Time $now.AddMinutes(-10)); simulatedData = $true; origin = 'SIMULATED'
  observations = 'Leitura sem calibração (simulada).'
} | Out-Null

Write-Host 'Criando alerta...'
Send-Api 'POST' '/alerts' @{
  deviceId = $online.id; severity = 'WARNING'
  title = 'Umidade do solo abaixo do esperado'
  message = 'A leitura recente indica umidade relativamente baixa.'
  reason = 'Valor demonstrativo abaixo da faixa de referência configurada para este cenário.'
} | Out-Null

Write-Host ''
Write-Host 'Pronto. Abra o app, entre com esta conta e puxe a tela para atualizar.' -ForegroundColor Green
Write-Host "Dispositivos criados: ESP32-A$suffix (online) e ESP32-B$suffix (offline)."