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
  Plantation: undefined;
};

export type SensorsStackParamList = {
  Sensors: undefined;
};

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
