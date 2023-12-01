import React from 'react';
import { Box, useTheme } from 'native-base';
import { Star } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';

type StarProps = {
  filled: boolean;
  onPress: () => void;
};

const StarIcon: React.FC<StarProps> = ({ filled, onPress }) => {
  const { colors } = useTheme();
  const weight = filled ? 'fill' : 'light';

  return (
    <TouchableOpacity onPress={onPress}>
      <Star size={40} weight={weight} color={colors.yellow[500]} />
    </TouchableOpacity>
  );
};

type RateProps = {
  value: number;
  setValue: (value: number) => void;
};

export const Rate: React.FC<RateProps> = ({ value = 0, setValue }) => {
  const handleStarClick = (index: number) => {
    setValue(index + 1);
    console.log(value)
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-between'}
    >
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          filled={index < value}
          onPress={() => handleStarClick(index)}
        />
      ))}
    </Box>
  );
};
