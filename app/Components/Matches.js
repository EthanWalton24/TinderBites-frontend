import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, Dimensions, RefreshControl, Animated, TouchableHighlight, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import ProgressBar from 'react-native-animated-progress';
import { Rating } from '@kolking/react-native-rating';
import ViewMoreText from 'react-native-view-more-text';

import NextIcon from '../assets/NextIcon.svg';
import ArrowIcon from '../assets/ArrowIcon.svg';
import MenuIcon from '../assets/MenuIcon.svg';
import PhoneIcon from '../assets/PhoneIcon.svg';
import MapIcon from '../assets/MapIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';

import {GOOGLE_API_KEY} from '@env';



function Matches({ matchesList }) {

    const {theme, toggleTheme} = useContext(ThemeContext);
    const primaryColor = theme === 'light' ? colors.light : colors.dark
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const contrastColor = theme === 'light' ? colors.dark : colors.light
    const accentColor = theme === 'light' ? colors.primary : colors.primary

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
    }, []);

    const carouselRef = React.useRef()
    const slidingPanelRef = React.useRef()

    const [carouselIndex, setCarouselIndex] = React.useState(1);
    const [selectedPlaceData, setSelectedPlaceData] = React.useState(matchesList[0]?.data);

    const scrolling = React.useRef(false)


    const handleMoveCarousel = (dir) => {

        if (dir == 1) {
            if (carouselRef.current?.getCurrentIndex()+1 >= matchesList.length) {
                setCarouselIndex(1);
            } else {
                setCarouselIndex(ind => ind+1);
            }
            carouselRef.current?.next()
        } else {
            if (carouselIndex <= 1) {
                setCarouselIndex(matchesList.length)
            } else {
                setCarouselIndex(ind => ind-1);
            }
            carouselRef.current?.prev()
        }

    }


    const [animVal1] = useState(new Animated.Value(0));
    const [animVal2] = useState(new Animated.Value(0));
    const [animVal3] = useState(new Animated.Value(0));
    const duration = 500

    const waitingAnim = () => {
        Animated.loop(
            Animated.sequence([
                Animated.sequence([
                    Animated.timing(animVal1, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true
                    }),
                    Animated.timing(animVal2, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true
                    }),
                    Animated.timing(animVal3, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true
                    }),
                    Animated.delay(duration/2)
                ]),
                Animated.parallel([
                    Animated.timing(animVal1, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true
                    }),
                    Animated.timing(animVal2, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true
                    }),
                    Animated.timing(animVal3, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true
                    }),
                ])
            ])
        ).start()
    }
    useEffect(() => {
        waitingAnim();
    }, []);



    //if map is empty render waiting anim
    if (matchesList.length < 1) {
        return (
            <ScrollView contentContainerStyle={[styles.container, {backgroundColor: primaryColor}]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={secondaryColor} tintColor={secondaryColor} />}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 25, color: contrastColor}}>No matches yet!</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{marginTop: 10, fontSize: 16, color: contrastColor}}>Waiting for group members to finish </Text>
                        <Animated.Text style={{marginTop: 10, fontSize: 16, color: contrastColor, opacity: animVal1}}>. </Animated.Text>
                        <Animated.Text style={{marginTop: 10, fontSize: 16, color: contrastColor, opacity: animVal2}}>. </Animated.Text>
                        <Animated.Text style={{marginTop: 10, fontSize: 16, color: contrastColor, opacity: animVal3}}>.</Animated.Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
    
    //otherwise load matches
    else {
        return (
            <ScrollView style={{flex: 1}} disableIntervalMomentum={true} snapToOffsets={[0, Dimensions.get('window').height - 130]} decelerationRate='fast' snapToEnd={false} showsVerticalScrollIndicator={false}>
                <View style={{backgroundColor: primaryColor, borderRadius: 20, height: Dimensions.get('window').height - 260}}>
                    <Carousel
                        loop
                        ref={carouselRef}
                        width={Dimensions.get('window').width}
                        height={Dimensions.get('window').height - 410}
                        data={matchesList}
                        mode='parallax'
                        modeConfig={{
                            parallaxScrollingOffset: 80
                        }}
                        scrollAnimationDuration={750}
                        onSnapToItem={(index) => {setCarouselIndex(index+1); setSelectedPlaceData(matchesList[index].data)}}
                        renderItem={({index, item}) => (
                            <View style={{width: '85%', marginHorizontal: '7.5%'}}>
                                <Image style={{width: '100%', aspectRatio: 1/1.15, borderRadius: 20}} source={{uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${item.data.photos[1].name.split('/').pop()}&maxwidth=1200&key=${GOOGLE_API_KEY}`}} key={item.data.displayName.text} />
                                <Text style={{marginTop: 30, color: contrastColor, fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{item.data.displayName.text}</Text>
                            </View>
                        )}
                    />

                    {/* carousel navigation */}
                    <View style={{marginHorizontal: 30, justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                            <TouchableOpacity activeOpacity={.5} onPress={() => {handleMoveCarousel(-1)}}><NextIcon width={35} height={35} stroke={greyColor} strokeWidth={1.2} style={{marginTop: 5, transform: [{rotateY: '180deg'}]}} /></TouchableOpacity >
                            <TouchableOpacity activeOpacity={.5} onPress={() => {handleMoveCarousel(1)}}><NextIcon width={35} height={35} stroke={greyColor} strokeWidth={1.2} style={{marginTop: 5}} /></TouchableOpacity >
                        </View>
                        
                        <ProgressBar
                            progress={((carouselIndex) / matchesList.length) * 100}
                            progressDuration={500}
                            height={6}
                            backgroundColor={accentColor}
                            trackColor={`${secondaryColor}`}
                            animated={true}
                        />

                        <Text style={{marginTop: 10, color:greyColor, fontSize: 16, textAlign: 'right', letterSpacing: 1.5}}>{(carouselIndex)}/{matchesList.length}</Text>
                    </View>
                </View>

                {/* more info section */}
                <LinearGradient colors={[secondaryColor+'66', primaryColor+'66', primaryColor]} style={{minHeight: Dimensions.get('window').height - 50, width: '100%', backgroundColor: secondaryColor+'66', borderTopLeftRadius: 40, borderTopRightRadius: 40}}>
                    
                    {/* header */}
                    <View style={{alignItems: 'center', paddingTop: 5, height: 80}}>
                        <ArrowIcon width={40} height={35} fill={greyColor} />
                        <Text style={{fontSize: 20, color: greyColor}}>See More</Text>
                    </View>

                    {/* info */}
                    <View style={{flex: 1, marginTop: 50}}>

                        {/* image */}
                        <Image source={{uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${selectedPlaceData.photos[0].name.split('/').pop()}&maxwidth=1200&key=${GOOGLE_API_KEY}`}} style={{width: '100%', aspectRatio: 1.5/1}} />
                        
                        {/* name section */}
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10}}>
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
                    </View>

                </LinearGradient>

                {/* add padding to bottom of scrollview */}
                <View style={{height: 50}}></View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    c: {
        width: (Dimensions.get('screen').width / 2) - 20,
        height: 'auto',
        margin: 10,
        borderRadius: 10
    },

    container: {
        flexGrow: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },

    imageContainer: {
        width: Dimensions.get('screen').width / 2,
        height: (Dimensions.get('screen').height - 210) / 2,
        borderWidth: 1,
    },

    image: {
        width: '100%',
        height: '100%'
    },

    imageMatchOverlay: {
        position: "absolute",
        width: "100%",
        bottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    imageNameOverlay: {
        position: "absolute",
        padding: 5,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: 15,
        fontWeight: "bold"
    },

})

export default React.memo(Matches);