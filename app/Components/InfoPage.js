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
            <Image source={{uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${selectedPlaceData.photos[0].name.split('/').pop()}&maxwidth=1200&key=${GOOGLE_API_KEY}`}} style={{width: '100%', aspectRatio: 1.5/1}} />
            
            {/* name section */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, borderBottomWidth: route ? 1 : 0, borderColor: greyColor}}>
                <View style={{paddingVertical: 20, flex: 1}}>
                    <Text style={{fontSize: 25, fontWeight: 'bold', color: contrastColor}}>{selectedPlaceData.displayName.text}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                        <Rating
                            disabled='true'
                            size={18}
                            rating={selectedPlaceData.rating}
                            fillColor='#f1c40f'
                            baseColor='transparent'
                            style={{alignSelf: 'flex-start'}}
                        />
                        <Text style={{fontSize: 18, position: 'absolute', left: (18*selectedPlaceData.rating)+((18*.3)*(selectedPlaceData.rating).toFixed(0))+10, marginTop: 3, color: colors.grey}}>{selectedPlaceData.rating.toFixed(1)} ({selectedPlaceData.userRatingCount} reviews)</Text>
                    </View>

                </View>

                <Text style={{fontSize: 24, color: greyColor, margin: 15}}>{selectedPlaceData.priceLevel=='PRICE_LEVEL_INEXPENSIVE' ? '$' : selectedPlaceData.priceLevel=='PRICE_LEVEL_MODERATE' ? '$$' : selectedPlaceData.priceLevel=='PRICE_LEVEL_EXPENSIVE' ? '$$$' : '$$$$'}</Text>
            </View>

            {/* button section */}
            {!route && 
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: greyColor}}>

                    <TouchableOpacity style={{paddingHorizontal: 20}} onPress={() => {Linking.openURL(`tel:${selectedPlaceData.internationalPhoneNumber.replace(' ','')}`)}}>
                        <PhoneIcon width={35} height={35} fill={accentColor} />
                        <Text style={{fontSize: 14, color: accentColor, textAlign: 'center'}}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingHorizontal: 20}}>
                        <MenuIcon width={35} height={35} fill={contrastColor} />
                        <Text style={{fontSize: 14, color: contrastColor, textAlign: 'center'}}>Menu</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{paddingHorizontal: 20}} onPress={() => {Linking.openURL(selectedPlaceData.googleMapsUri)}}>
                        <MapIcon width={35} height={35} fill={colors.red} stroke={primaryColor} strokeWidth={.5} />
                        <Text style={{fontSize: 14, color: colors.red, textAlign: 'center'}}>Map</Text>
                    </TouchableOpacity>
                </View>
            }

            {('editorialSummary' in selectedPlaceData) && 
                <View style={{marginHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderColor: greyColor}}>
                    <Text style={{color: contrastColor, fontSize: 18, fontWeight: 'bold'}}>Overview</Text>
                    <Text style={{marginTop: 15, color: contrastColor, fontSize: 16}}>{selectedPlaceData.editorialSummary.text}</Text>
                </View>
            }

            {selectedPlaceData.reviews.map((review, index) => {
                return (
                    <View style={{marginHorizontal: 10, marginTop: 20}} key={review.authorAttribution.displayName}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={{width: 40, aspectRatio: 1/1, marginRight: 10}} source={{uri: review.authorAttribution.photoUri}} />
                                <View>
                                    <Text style={{color: contrastColor, fontSize: 18}}>{review.authorAttribution.displayName}</Text>
                                    <Text style={{color: greyColor, fontSize: 14}}>{review.relativePublishTimeDescription}</Text>
                                </View>
                            </View>
                            <Rating
                                disabled='true'
                                size={18}
                                rating={review.rating}
                                fillColor={accentColor}
                                baseColor={secondaryColor}
                            />
                        </View>
                        <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={(onPress) => <Text style={{color: accentColor}} onPress={onPress}>See more</Text>}
                        renderViewLess={(onPress) => <Text style={{color: accentColor}} onPress={onPress}>See less</Text>}
                        textStyle={{marginTop: 10, color: contrastColor, fontSize: 15}}
                        >
                            {review.text.text}
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