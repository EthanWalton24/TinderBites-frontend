import React, {useContext} from 'react';
import { View, Text, Button, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity, Keyboard, TextInput, TouchableWithoutFeedback, Pressable } from 'react-native';

import PersonIcon from '../assets/PersonIcon';
import MailIcon from '../assets/MailIcon';
import LockIcon from '../assets/LockIcon';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';
import { setData } from './Storage';

import {HOST_IP,TOKEN} from '@env';





function Login({ navigation, setPage }) {

    const { theme, toggleTheme } = useContext(ThemeContext);
	const mainColor = theme === 'light' ? colors.light : colors.dark
	const secondaryColor = theme === 'light' ? colors.dark : colors.light

    const [type, setType] = React.useState('Login')
    const [focused, setFocused] = React.useState('None')

    const username = React.useRef('')
    const email = React.useRef('')
    const password = React.useRef('')
    const passwordConfirm = React.useRef('')

    const [showMessage, setShowMessage] = React.useState(false)
    const [message, setMessage] = React.useState('')


    const handleLoginRegister = async () => {
        let validUsername = false
        let validEmail = false
        let validPassword = false
        let url = `http://${HOST_IP}/api/auth/${type.toLowerCase()}`

        // console.log(username.current, email.current, password.current, passwordConfirm.current, url)

        // validate email and password
        if (type == 'Register') {

            //validate username (only letters and numbers allowed)
            if (/^[A-Za-z0-9]*$/.test(username.current)) {
                validUsername = true
            } else {
                setMessage('Username may only contain letters and numbers')
            }

            //validate email
            if ( (email.current.split('@').length-1 == 1) && (email.current.split('.com').length-1 == 1) && (email.current.substring(0,email.current.indexOf('@')).length > 0) ) {
                validEmail = true
            } else {
                setMessage('Invalid email')
            }

            //validate password
            if ( (password.current == passwordConfirm.current) && (password.current.length >= 8) ) {
                validPassword = true
            } else if (password.current != passwordConfirm.current) {
                setMessage('Passwords do not match')
            } else {
                setMessage('Password must be 8 characters')
            }

            if (!validEmail && !validPassword) {
                setMessage('Invalid credentials')
            }

            if (!validUsername || !validEmail || !validPassword) {
                setShowMessage(true)
            } else {
                setShowMessage(false)
            }
        }


        // send login/register request
        if ( (type == 'Register' && validUsername && validEmail && validPassword) || (type == 'Login') ) {
            
            //send data to API
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'username': username.current,
                    'email' : email.current.toLowerCase(),
                    'password': password.current
                })
            })
            try {
                res = await res.json()
            } catch {
                setMessage('Username already taken')
                setShowMessage(true)
                return
            }

            // check success
            if ('token' in res) {
                setShowMessage(false)
                setData('username', username.current)
                setData('token', res['token'])
                setPage('Home')
                navigation.navigate("Home")
            } 

            //check failure
            else {
                setMessage('Invalid username or password')
                setShowMessage(true)
            }
        }
    };

    const handleRegisterSwitch = () => {
        if (type == 'Login') {
            setType('Register')
        } else {
            setType('Login')
        }
    }
    

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setFocused('None')}} accessible={false}>
            <View style={[styles.centerContainer, { top: type == 'Register' ? '15%' : '25%' }]}>

                {/* logo */}
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text style={[styles.name, theme == 'dark' ? styles.shadow : null, {color: secondaryColor, shadowRadius: 15}]}>Tinder</Text>
                    <Text style={[styles.name, theme == 'dark' ? styles.shadow : null, {color: colors.primary, shadowRadius: 15}]}>Bites</Text>
                </View>

                {/* username field */}
                <View style={(type == 'Login' && focused == 'Username') ? (styles.inputContainerLoginActive) : ((type == 'Login' && focused != 'Username') ? (styles.inputContainerLogin) : ((type == 'Register' && focused == 'Username') ? (styles.inputContainerRegisterActive) : (styles.inputContainerRegister)))}>
                    <PersonIcon style={{marginHorizontal: 10}} width={30} height={30} fill={focused == 'Username' && type == 'Login' ? colors.primary : colors.grey} />
                    <TextInput onChangeText={(newText) => {username.current = newText}} autoComplete="off" autoCapitalize='none' autoCorrect={false} selectionColor={secondaryColor} onFocus={() => {setFocused('Username')}} style={[styles.inputField, {color: secondaryColor}]} placeholder="Username" keyboardType="default" />
                </View>

                {/* email field */}
                {(type == 'Register') && 
                    <View style={[(type == 'Login' && focused == 'Email') ? (styles.inputContainerLoginActive) : ((type == 'Login' && focused != 'Email') ? (styles.inputContainerLogin) : ((type == 'Register' && focused == 'Email') ? (styles.inputContainerRegisterActive) : (styles.inputContainerRegister))),{marginTop: 25}]}>
                        <MailIcon style={{marginHorizontal: 10}} width={30} height={30} fill={focused == 'Email' && type == 'Login' ? colors.primary : colors.grey} />
                        <TextInput onChangeText={(newText) => {email.current = newText}} autoComplete="email" autoCapitalize='none' autoCorrect={false} selectionColor={secondaryColor} onFocus={() => {setFocused('Email')}} style={[styles.inputField, {color: secondaryColor}]} placeholder="Email" keyboardType="email-address" />
                    </View>
                }

                {/* password field */}
                <View style={[(type == 'Login' && focused == 'Password') ? (styles.inputContainerLoginActive) : ((type == 'Login' && focused != 'Password') ? (styles.inputContainerLogin) : ((type == 'Register' && focused == 'Password') ? (styles.inputContainerRegisterActive) : (styles.inputContainerRegister))),{marginTop: 25}]}>
                    <LockIcon style={{marginHorizontal: 10}} width={30} height={30} stroke={focused == 'Password' && type == 'Login' ? colors.primary : colors.grey} />
                    <TextInput onChangeText={(newText) => {password.current = newText}} autoComplete="off" selectionColor={secondaryColor} onFocus={() => {setFocused('Password')}} style={[styles.inputField, {color: secondaryColor}]} secureTextEntry={true} placeholder="Password" keyboardType="default" />
                </View>

                {/* confirm password field */}
                {(type == 'Register') && 
                    <View style={[(type == 'Login' && focused == 'Confirm') ? (styles.inputContainerLoginActive) : ((type == 'Login' && focused != 'Confirm') ? (styles.inputContainerLogin) : ((type == 'Register' && focused == 'Confirm') ? (styles.inputContainerRegisterActive) : (styles.inputContainerRegister))),{marginTop: 25}]}>
                        <LockIcon style={{marginHorizontal: 10}} width={30} height={30} stroke={focused == 'Confirm' && type == 'Login' ? colors.primary : colors.grey} />
                        <TextInput onChangeText={(newText) => {passwordConfirm.current = newText}} autoComplete="off" selectionColor={secondaryColor} onFocus={() => {setFocused('Confirm')}} style={[styles.inputField, {color: secondaryColor}]} secureTextEntry={true} placeholder="Confirm Password" keyboardType="default" />
                    </View>
                }

                {/* message */}
                {(showMessage == true) &&
                    <View style={ styles.message}>
                        <Text style={{color: colors.light}}>{message}</Text>
                    </View>
                }

                {/* login/register button */}
                <Pressable style={({ pressed }) => [pressed ? styles.shadow : styles.button , styles.button ]} onPress={handleLoginRegister}><View><Text style={{color: colors.light, textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>{type == 'Login' ? "Login" : "Register"}</Text></View></Pressable>

                {/* switch type text */}
                <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
                    <Text style={{paddingHorizontal: 5, paddingVertical: 10, color: secondaryColor, textAlign: 'center', fontSize: 16}}>{type == 'Login' ? "Don't have an account?" : "Have an account?"}</Text>
                    <TouchableOpacity onPress={handleRegisterSwitch}>
                        <Text style={{paddingHorizontal: 5, paddingVertical: 10, color: colors.primary, textAlign: 'center', fontSize: 16}}>{type == 'Login' ? "Register" : "Login"}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

    name: {
        marginBottom: 40,
        fontSize: 35,
        fontWeight: "bold",
    },

    centerContainer: {
        position: 'absolute',
        width: '100%',
        height: '80%',
        letterSpacing: 1.2,
        
    },

    inputContainerLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '15%',
        marginBottom: 5,
        padding: 10,
        backgroundColor: colors.grey+'33',
        borderRadius: 5,
        fontSize: 14,
        fontWeight: 'bold',
    },

    inputContainerRegister: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '15%',
        marginBottom: 5,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        fontSize: 14,
        fontWeight: 'bold',
    },

    inputContainerLoginActive: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '15%',
        marginBottom: 5,
        padding: 10,
        backgroundColor: colors.grey+'33',
        borderRadius: 5,
        fontSize: 14,
        fontWeight: 'bold',
    },

    inputContainerRegisterActive: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '15%',
        marginBottom: 5,
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },

    inputField: {
        padding: 5,
        fontSize: 18,
        flex: 1
    },

    message : {
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: colors.red, 
        marginHorizontal: '15%'
    },

    button: {
        marginTop: 25,
        width: '70%',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: colors.primary,
    },

    shadow: {
        shadowColor: colors.primary,
        shadowOpacity: 1,
        shadowRadius: 8,
        shadowOffset: {height: 0}
    }
})

export default React.memo(Login);