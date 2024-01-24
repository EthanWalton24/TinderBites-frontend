import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toggle from "react-native-toggle-element";

import ThemeContext from './ThemeContext';
import colors from '../config/colors';

import PersonIcon from '../assets/PersonIcon.svg';
import GroupIcon from '../assets/GroupIcon.svg';
import ResetIcon from '../assets/ResetIcon.svg';

function Header({ page, useGroup, setUseGroup, fetchPlacesData, placesData, visibleCards, cardIndexRef }) {

    const {theme, toggleTheme} = useContext(ThemeContext);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary

    const [allowReload, setAllowReload] = useState(false);


    const handleReloadPlaces = () => {
        fetchPlacesData(forceRefresh=true)
    }

    useEffect(() => {
        if (cardIndexRef.current >= placesData.length-1) {
            setAllowReload(true)
        } else {
            setAllowReload(false)
        }
    }, [visibleCards])

    return (
        <View style={styles.container}>

            <Text style={[styles.text, {color: contrastColor}]}>Tinder</Text>
            <Text style={[styles.text, {color: accentColor}]}>Bites</Text>

            {page == 'Home' && 
                <TouchableOpacity disabled={!allowReload} style={{position: 'absolute', right: 10, padding: 5, opacity: allowReload ? 1 : 0}} onPress={() => handleReloadPlaces()}>
                    <ResetIcon width={22} height={22} fill={contrastColor} />
                </TouchableOpacity>
            }

            {/* switch to group */}
            {/* {page == 'Home' &&
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
            } */}
        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
		height: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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