import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, Dimensions, RefreshControl, Animated, TouchableHighlight, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Rating } from '@kolking/react-native-rating';
import ViewMoreText from 'react-native-view-more-text';


import ArrowIcon from '../assets/ArrowIcon.svg';
import MenuIcon from '../assets/MenuIcon.svg';
import PhoneIcon from '../assets/PhoneIcon.svg';
import MapIcon from '../assets/MapIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';

import {GOOGLE_API_KEY} from '@env';



function InfoPage({ route, navigation, setPage, placeData }) {

    const {theme, toggleTheme} = useContext(ThemeContext);
    const primaryColor = theme === 'light' ? colors.light : colors.dark
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const contrastColor = theme === 'light' ? colors.dark : colors.light
    const accentColor = theme === 'light' ? colors.primary : colors.primary

    var selectedPlaceData;
    if (route) {
        selectedPlaceData = route.params.selectedPlaceData
    } else {
        selectedPlaceData = placeData
    }


    return (

        <ScrollView style={{flex: 1, paddingTop: route ? 0 : 50}} showsVerticalScrollIndicator={false} 
        onScroll={route ? ({nativeEvent}) => {
            if (nativeEvent.contentOffset.y < -15) {
                navigation.navigate('Home')
                setPage('Home')
            }
        } : null}
        scrollEventThrottle={route ? 600 : 1}
        >

            {route && 
                <View style={{height: 50, alignSelf: 'flex-end', justifyContent:'center', marginRight: 10, transform: [{rotate: '180deg'}, {scaleX: .8}]}}>
                    <TouchableOpacity style={{paddingHorizontal: 10}} onPress={() => {navigation.navigate('Home'); setPage('Home')}}>
                        <ArrowIcon width={30} height={30} fill={contrastColor} />
                    </TouchableOpacity>
                </View>
            }

            {/* image */}
            <Image source={{uri: `${selectedPlaceData.photos[1].prefix}original${selectedPlaceData.photos[1].suffix}`}} style={{width: '100%', aspectRatio: 1.5/1}} />
            
            {/* name section */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, borderBottomWidth: route ? 1 : 0, borderColor: greyColor}}>
                <View style={{paddingVertical: 20, flex: 1}}>
                    <Text style={{fontSize: 25, fontWeight: 'bold', color: contrastColor}}>{selectedPlaceData.name}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                        <Rating
                            disabled='true'
                            size={18}
                            rating={((selectedPlaceData.rating/2).toFixed(1))}
                            fillColor='#f1c40f'
                            baseColor='transparent'
                            style={{alignSelf: 'flex-start'}}
                        />
                        <Text style={{fontSize: 18, position: 'absolute', left: (18*((selectedPlaceData.rating/2).toFixed(1)))+(18*.3*((selectedPlaceData.rating/2).toFixed(1)))+10, marginTop: 3, color: colors.grey}}>{((selectedPlaceData.rating/2).toFixed(1))}</Text>
                    </View>

                </View>

                <Text style={{fontSize: 24, color: greyColor, margin: 15}}>{'$'.repeat(selectedPlaceData.price)}</Text>
            </View>

            {/* button section */}
            {!route && 
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: greyColor}}>

                    <TouchableOpacity style={{paddingHorizontal: 20}} onPress={() => {Linking.openURL(`tel:${selectedPlaceData.tel.replace(' ','')}`)}}>
                        <PhoneIcon width={35} height={35} fill={accentColor} />
                        <Text style={{fontSize: 14, color: accentColor, textAlign: 'center'}}>Call</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={{paddingHorizontal: 20}}>
                        <MenuIcon width={35} height={35} fill={contrastColor} />
                        <Text style={{fontSize: 14, color: contrastColor, textAlign: 'center'}}>Menu</Text>
                    </TouchableOpacity> */}
                    
                    <TouchableOpacity style={{paddingHorizontal: 20}} onPress={() => {Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlaceData.name)},${encodeURIComponent(selectedPlaceData.location.address)}`)}}>
                        <MapIcon width={35} height={35} fill={colors.red} stroke={primaryColor} strokeWidth={.5} />
                        <Text style={{fontSize: 14, color: colors.red, textAlign: 'center'}}>Map</Text>
                    </TouchableOpacity>
                </View>
            }

            {/* description section */}
            {('description' in selectedPlaceData) && 
                <View style={{marginHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderColor: greyColor}}>
                    <Text style={{color: contrastColor, fontSize: 18, fontWeight: 'bold'}}>Overview</Text>
                    <Text style={{marginTop: 15, color: contrastColor, fontSize: 16}}>{selectedPlaceData.description}</Text>
                </View>
            }

            {/* tips section */}
            {selectedPlaceData.tips.map((tip, index) => {
                let diffDate = new Date(new Date() - new Date(tip.created_at))

                let timeDelta;
                if (diffDate.toISOString().slice(0, 4) - 1970 > 0) {
                    timeDelta = `${diffDate.toISOString().slice(0, 4) - 1970} year${diffDate.toISOString().slice(0, 4) - 1970 > 1 ? 's' : ''} ago`
                } else if (diffDate.getMonth() > 0) {
                    timeDelta = `${diffDate.getMonth()} month${diffDate.getMonth() > 1 ? 's' : ''} ago`
                } else if (diffDate.getDate()-1 > 0) {
                    timeDelta = `${diffDate.getDate()-1} day${diffDate.getDate()-1 > 1 ? 's' : ''} ago`
                } else if (diffDate.getHours() > 0) {
                    timeDelta = `${diffDate.getHours()} hour${diffDate.getHours() > 1 ? 's' : ''} ago`
                } else if (diffDate.getMinutes() > 0) {
                    timeDelta = `${diffDate.getMinutes()} minute${diffDate.getMinutes() > 1 ? 's' : ''} ago`
                } else {
                    timeDelta = `${diffDate.getSeconds()} second${diffDate.getSeconds() > 1 ? 's' : ''} ago`
                }
                return (
                    <View style={{marginHorizontal: 10, marginTop: 20}} key={index}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{color: greyColor, fontSize: 14}}>{timeDelta}</Text>
                        </View>
                        <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={(onPress) => <Text style={{color: accentColor}} onPress={onPress}>See more</Text>}
                        renderViewLess={(onPress) => <Text style={{color: accentColor}} onPress={onPress}>See less</Text>}
                        textStyle={{marginTop: 5, color: contrastColor, fontSize: 15}}
                        >
                            {tip.text}
                        </ViewMoreText>
                    </View>
                )
            })}

            {/* padding on bottom of screen */}
            <View style={{height: 50}}></View>

        </ScrollView>

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

export default InfoPage;