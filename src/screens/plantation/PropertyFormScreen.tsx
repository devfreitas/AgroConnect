import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { PropertyForm } from '@/components/shared/PropertyForm';
import { Screen } from '@/components/shared/Screen';
import { ErrorState, Loader } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { createProperty, getProperty, updateProperty } from '@/services';
import type { PlantationStackScreenProps } from '@/types/navigation';

import { emptyPropertyForm, toFormValues, toPropertyInput } from './schemas';

type FormScreenProps = PlantationStackScreenProps<'PropertyForm'>;

export function PropertyFormScreen(props: FormScreenProps) {
  const propertyId = props.route.params?.propertyId;

  return propertyId ? (
    <EditPropertyContent {...props} propertyId={propertyId} />
  ) : (
    <CreatePropertyContent {...props} />
  );
}

function CreatePropertyContent({ navigation }: FormScreenProps) {
  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <Screen
        title="Nova propriedade"
        subtitle="Informe os dados da propriedade."
        safeTop={false}
      >
        <PropertyForm
          initialValues={emptyPropertyForm}
          submitLabel="Cadastrar propriedade"
          onSubmit={async (values) => {
            await createProperty(toPropertyInput(values));
            navigation.popTo('Plantation', { notice: 'Propriedade cadastrada com sucesso.' });
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

function EditPropertyContent({ navigation, propertyId }: FormScreenProps & { propertyId: string }) {
  const { data, error, loading, reload } = useRemoteData(
    (signal) => getProperty(propertyId, signal),
    [propertyId],
  );

  if (loading) {
    return (
      <Screen title="Editar propriedade" safeTop={false}>
        <Loader message="Carregando propriedade..." />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen title="Editar propriedade" safeTop={false}>
        <ErrorState
          title="Não foi possível carregar a propriedade"
          message={error?.message}
          onRetry={reload}
        />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <Screen
        title="Editar propriedade"
        subtitle="Atualize os dados e salve."
        safeTop={false}
      >
        <PropertyForm
          initialValues={toFormValues(data)}
          submitLabel="Salvar alterações"
          onSubmit={async (values) => {
            await updateProperty(propertyId, toPropertyInput(values));
            navigation.popTo('PropertyDetail', {
              propertyId,
              notice: 'Propriedade atualizada com sucesso.',
            });
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
