import React, { useState, useContext } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import * as RootNavigation from '../RootNavigation';
import ThemeContext from './ThemeContext';
import colors from '../config/colors';

import LayersIcon from '../assets/LayersIcon.svg'
import LinkIcon from '../assets/LinkIcon.svg'
import PersonIcon from '../assets/PersonIcon.svg'



function Navbar({ page, setPage, setSubMenuShown }) {
    
    const {theme, toggleTheme} = useContext(ThemeContext);
	const mainColor = theme === 'light' ? colors.light : colors.dark
	const secondaryColor = theme === 'light' ? colors.dark : colors.light

    return (
        <View style={[styles.container, {backgroundColor: mainColor}]}>
            <TouchableHighlight activeOpacity={.6} underlayColor={mainColor} style={styles.navIcon} onPress={() => {setPage('Home'); RootNavigation.navigate("Home"); setSubMenuShown(false)}}><LayersIcon width={35} height={35} fill={page === "Home" ? colors.primary : secondaryColor} /></TouchableHighlight>
            <TouchableHighlight activeOpacity={.6} underlayColor={mainColor} style={styles.navIcon} onPress={() => {setPage('Matches'); RootNavigation.navigate("Matches"); setSubMenuShown(false)}}><LinkIcon width={35} height={35} fill={page === "Matches" ? colors.primary : secondaryColor} /></TouchableHighlight>
            <TouchableHighlight activeOpacity={.6} underlayColor={mainColor} style={styles.navIcon} onPress={() => {setPage('Account'); RootNavigation.navigate("Account"); setSubMenuShown(false)}}><PersonIcon width={35} height={35} fill={page === "Account" ? colors.primary : secondaryColor} /></TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: '100%',
		height: 60,
		borderTopColor: colors.grey,
		borderTopWidth: 1,
        zIndex: 1
    },

    navIcon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }

})

export default Navbar;