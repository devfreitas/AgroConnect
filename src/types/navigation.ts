import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

// Fluxo de acesso (sem sessão)
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

// Pilhas de cada aba (área logada)
export type HomeStackParamList = {
  Home: undefined;
};

export type PlantationStackParamList = {
  /** `notice`: mensagem de sucesso exibida ao voltar de um formulário. */
  Plantation: { notice?: string } | undefined;
  PropertyDetail: { propertyId: string; notice?: string };
  /** Sem `propertyId`: cadastro de nova propriedade. Com `propertyId`: edição. */
  PropertyForm: { propertyId?: string } | undefined;
};

export type PlantationStackScreenProps<T extends keyof PlantationStackParamList> =
  NativeStackScreenProps<PlantationStackParamList, T>;

export type SensorsStackParamList = {
  Sensors: undefined;
  DeviceDetail: { deviceId: string };
};

export type SensorsStackScreenProps<T extends keyof SensorsStackParamList> =
  NativeStackScreenProps<SensorsStackParamList, T>;

export type AnalyticsStackParamList = {
  Analytics: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

// Abas da área logada
export type AppTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  PlantationTab: NavigatorScreenParams<PlantationStackParamList>;
  SensorsTab: NavigatorScreenParams<SensorsStackParamList>;
  AnalyticsTab: NavigatorScreenParams<AnalyticsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
