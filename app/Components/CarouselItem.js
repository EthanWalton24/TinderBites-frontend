import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';


function CarouselItem({ imgURI, name, glowOpacity }, ref) {

    const {theme, toggleTheme} = useContext(ThemeContext);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary

    useImperativeHandle(ref, () => ({
        glowOn() {
            Animated.timing(glowOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }).start();
        },
        glowOff() {
            Animated.timing(glowOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start();
        },
        alert() {
            console.log('hi')
        }
    }))


    return (
        <Animated.View ref={ref} style={{width: '85%', marginHorizontal: '7.5%', shadowColor: accentColor, shadowRadius: 50, shadowOpacity: glowOpacity}}>
            <Image style={{width: '100%', aspectRatio: 1/1.15, borderRadius: 20}} source={{uri: imgURI}} key={name} />
            <Text style={{marginTop: 30, color: contrastColor, fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{name}</Text>
        </Animated.View>
    );
}


export default forwardRef(CarouselItem)