import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toggle from "react-native-toggle-element";

import ThemeContext from './ThemeContext';
import colors from '../config/colors';

import PersonIcon from '../assets/PersonIcon.svg';
import GroupIcon from '../assets/GroupIcon.svg';

function Header({ page, useGroup, setUseGroup }) {

    const {theme, toggleTheme} = useContext(ThemeContext);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary


    return (
        <View style={styles.container}>

            <View style={styles.logo}>
                <Text style={[styles.text, {color: contrastColor}]}>Tinder</Text>
                <Text style={[styles.text, {color: accentColor}]}>Bites</Text>
            </View>

            {page == 'Home' &&
                <Toggle 
                containerStyle={styles.switchContainer}
                thumbInActiveComponent={
                    <PersonIcon width={22} height={22} fill={contrastColor} />
                }
                thumbActiveComponent={
                    <GroupIcon width={25} height={25} fill={contrastColor} />
                }
                thumbButton={{width: 30, height: 30, activeBackgroundColor: accentColor, inActiveBackgroundColor: accentColor}}
                trackBar={{activeBackgroundColor: secondaryColor, inActiveBackgroundColor: secondaryColor, width: 60, height: 30}}
                value={useGroup} 
                onPress={() => {
                    setUseGroup(prevVal => !prevVal)
                }} 
                animationDuration={250}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
		height: 40,
        width: '100%'
	},

    logo: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        width: 'auto',
        zIndex: 1
    },

    text: {
        fontSize: 20,
        fontWeight: "bold",
    },

    switchContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 15,
        height: 40,
        paddingVertical: 5,
        zIndex: 2
    }
})

export default React.memo(Header);