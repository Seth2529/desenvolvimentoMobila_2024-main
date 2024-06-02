import { ButtonApp, Title } from "./style";





interface Props{
    title:string,
    onPress: () => Promise<void>;
}

const CustomButton = ({title, onPress, ...rest}: Props) => {
    return(
        <ButtonApp {...rest} onPress={onPress}>
            <Title>{title}</Title>
        </ButtonApp>
    )
}

export default CustomButton;