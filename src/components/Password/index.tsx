import { TextInputProps } from 'react-native';
import { Container,InputPassword,IconEye } from './style';
import React, {useState} from 'react';

interface PasswordProps extends TextInputProps{

}

const PassWordInput = ({ ...rest }: PasswordProps) => {

    const eye = 'eye';
    const eyeOff = 'eye-slash';

    const[iconPass, setIconPass] = useState<'eye'|'eye-slash'>(eyeOff);
    const[flShowPass,setShowPass] = useState<boolean>(true);

    function handleChangeIcon(){
        let icon: 'eye'|'eye-slash' = iconPass === eye ? eyeOff : eye;
        let flShowPassAux = !flShowPass;
        setShowPass(flShowPassAux);
        setIconPass(icon);
    }

    return(
        <Container>
        <InputPassword {...rest}  
        secureTextEntry={flShowPass}
        />
       <IconEye             
                  name={iconPass}
                  size={28}                
                  onPress={handleChangeIcon}
  
        />
        </Container>
    );
};

export default PassWordInput;