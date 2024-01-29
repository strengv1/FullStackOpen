// interface NumValues {
//   height: number;
//   weight: number;
// }

// const validateBmiArgs = (args: string[]): NumValues => {
//   if (args.length < 4) throw new Error('Not enough arguments');
//   if (args.length > 4) throw new Error('Too many arguments');

//   if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
//     return {
//       height: Number(args[2]),
//       weight: Number(args[3])
//     }
//   } else {
//     throw new Error('Provided values were not numbers!');
//   }
// }

export function calculateBmi(height: number, weight: number) : string {
  let heightInMeters = height / 100;
  let bmi = weight / (heightInMeters * heightInMeters)
  return getBmiMessage(bmi)
}

const getBmiMessage = (bmi: number) : string => {

  if (bmi < 16) {
    return 'Underweight (Severe thinness)';
  } else if (bmi >= 16 && bmi < 17) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi >= 17 && bmi < 18.5) {
    return 'Underweight (Mild thinness)';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal (healthy weight)';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight (Pre-obese)';
  } else if (bmi >= 30 && bmi < 35) {
    return 'Obese (Class I)';
  } else if (bmi >= 35 && bmi < 40) {
    return 'Obese (Class II)';
  } else {
    return 'Obese (Class III)';
  }
}

// try {
//   const { height, weight } = validateBmiArgs(process.argv);
//   console.log(calculateBmi(height, weight));
// } catch (error: unknown) {
//   let errorMessage = 'Something bad happened.'
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage);
// }
