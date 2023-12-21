import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';

function Header(props) {

    const {theme, toggleTheme} = useContext(ThemeContext);
	const mainColor = theme === 'light' ? colors.light : colors.dark
	const secondaryColor = theme === 'light' ? colors.dark : colors.light


    return (
        <View style={[styles.container, {backgroundColor: mainColor}]}>
            <Text style={[styles.text, {color: secondaryColor}]}>Tinder</Text>
            <Text style={[styles.text, {color: colors.primary}]}>Bites</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
		width: '100%',
		height: 40,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: 10,
        zIndex: 1
	},

    text: {
        fontSize: 20,
        fontWeight: "bold",
    }
})

export default React.memo(Header);