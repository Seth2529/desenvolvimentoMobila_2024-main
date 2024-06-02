import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';

export const Container = styled.View`
margin-bottom: 16px;
height: 40px;
border-color: gray;
border-radius: 8px;
border-width: 1px;
width: 50%;
flex-direction: row;
justify-content: space-between;
background-color: #fff;

`;

export const InputPassword = styled.TextInput`
width: 76%;
height: 40px;
margin-bottom: 20px;
padding-horizontal: 10px;

`;

export const IconEye = styled(FontAwesome)`
background-color: #fff;
border-color: white;
border-radius: 8px;
border-width: 1px;
padding-horizontal: 8px;
margin-top: 6px;
`;