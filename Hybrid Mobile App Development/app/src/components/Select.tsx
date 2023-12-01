import {
  Select as NativeBaseSelect,
  ISelectProps,
  FormControl,
  FlatList,
  ISelectItemProps,
  CheckIcon
} from 'native-base';

type Props = ISelectProps & {
  items: ISelectItemProps[]
};

export function Select({ items, ...rest }: Props) {

  if (items.length <= 0) return null;

  return (
    <FormControl mb={4}>
      <NativeBaseSelect
        bg='gray.100'
        h={11}
        px={4}
        borderWidth={0}
        fontSize='md'
        color='gray.700'
        fontFamily='body'
        placeholderTextColor='gray.400'
        defaultValue={items[0].value}
        _selectedItem={{
          endIcon: <CheckIcon size="5" />
        }}
        {...rest}
      >
        {items.map(item => {
          return (
            <NativeBaseSelect.Item
              label={item.label}
              value={item.value}
              key={item.value}
            />
          );
        })}
      </NativeBaseSelect>
    </FormControl>
  );
}
