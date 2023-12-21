import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TinderCard } from 'rn-tinder-card';
import { Rating } from '@kolking/react-native-rating';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { getDistance } from 'geolib';

import UndoIcon from '../assets/UndoIcon.svg';
import XIcon from '../assets/XIcon.svg';
import QuestionMarkIcon from '../assets/QuestionMarkIcon.svg';
import CheckIcon from '../assets/CheckIcon.svg';
import CarIcon from '../assets/CarIcon.svg';
import LocationIcon from '../assets/LocationIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';
import { setData, getData, removeData } from './Storage';

import {HOST_IP,TOKEN, GOOGLE_API_KEY} from '@env';




function Home({ navigation, addMatchData, setPage }) {

    const { theme, toggleTheme } = useContext(ThemeContext);
	const mainColor = theme === 'light' ? colors.light : colors.dark
	const secondaryColor = theme === 'light' ? colors.dark : colors.light
    
    const tinderCardsRef = React.useRef([]);
    const cardIndexRef = React.useRef(2);

    const [placesData, setPlacesData] = React.useState([]);
    const [visibleCards, setVisibleCards] = React.useState([])


    async function fetchPlacesData() {
        let token = await (getData('token'))
        let res;
        let data = await getData('placesData')
        if (data == null) {
            res = await fetch(`http://${HOST_IP}/api/getPlaces`, {
                method: 'GET',
                headers: {
                    "Authorization": `Token ${token}`
                },
            })
            res = await res.json()
            await setData('placesData', JSON.stringify(res))
        } else {
            res = JSON.parse(data)
            // await setData('placesData', null)
            
        } 
        await setPlacesData(res)
        setVisibleCards(await res.slice(0,3).reverse())
        return res
    }

    useEffect(() => {
        fetchPlacesData()
        // .then((placesData) => {
        //     console.log(placesData[0])
        // })
    }, [theme])


    const renderNextCard = () => {
        const newCard = placesData[cardIndexRef.current]
        setVisibleCards(cards => [newCard, ...cards.splice(0,3)])
    }


    const handleSwipe = async (data) => {
        cardIndexRef.current = cardIndexRef.current + 1
        if (cardIndexRef.current < placesData.length) {
            renderNextCard()
        }
        
        if (data['swipe'] != 'no') {
            addMatchData(data)
        }
    }


    const OverlayRight = () => {
        return (
            <View
            style={[
                styles.overlayLabelContainer,
                {
                borderColor: colors.green,
                top: 50,
                left: 50
                },
            ]}
            >
                <Text style={[styles.overlayLabelText, {color: colors.green}]}>Yes</Text>
            </View>
        );
    };
    const OverlayLeft = () => {
        return (
            <View
            style={[
                styles.overlayLabelContainer,
                {
                borderColor: colors.red,
                top: 50,
                right: 50
                },
            ]}
            >
                <Text style={[styles.overlayLabelText, {color: colors.red}]}>No</Text>
            </View>
        );
    };
    const OverlayTop = () => {
        return (
            <View
            style={[
                styles.overlayLabelContainer,
                {
                borderColor: colors.primary,
                position: "relative",
                marginTop: (Dimensions.get('screen').height - 420),
                alignSelf: "center"
                },
            ]}
            >
                <Text style={[styles.overlayLabelText, {color: colors.primary}]}>Maybe</Text>
            </View>
        );
    };

    

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
    
            <View style={[styles.container, {backgroundColor: mainColor}]}>
                <View style={styles.centered}>
                    <Text style={{fontSize: 25, color: secondaryColor}}>That is all!</Text>
                    <TouchableOpacity style={[styles.matchesButton, {backgroundColor: secondaryColor}]} onPress={() => {setPage('Matches');navigation.navigate("Matches");}}><Text style={{color: mainColor, fontSize: 20}}>Matches</Text></TouchableOpacity>
                </View>
                

                {/* cards */}
                {visibleCards.map((item, index) => {
                    // if (index == 0) {
                    //     console.log(item)
                    // }
                    return (
                        <View style={[styles.cardContainer]} pointerEvents="box-none" key={item.displayName.text}>
                            <TinderCard
                            key={item.displayName.text}
                            ref={(el) => (tinderCardsRef.current[index] = el)}
                            cardWidth={Dimensions.get('screen').width - 18}
                            cardHeight={Dimensions.get('screen').height - 310}
                            OverlayLabelRight={OverlayRight}
                            OverlayLabelLeft={OverlayLeft}
                            OverlayLabelTop={OverlayTop}
                            cardStyle={[styles.card, styles.shadow, {backgroundColor: secondaryColor}]}
                            onSwipedRight={() => {
                                handleSwipe({'data': item, 'swipe': 'yes'});
                            }}
                            onSwipedTop={() => {
                                handleSwipe({'data': item, 'swipe': 'maybe'});
                            }}
                            onSwipedLeft={() => {
                                handleSwipe({'data': item, 'swipe': 'no'});
                            }}
                            disableBottomSwipe={true}
                            >

                                {/* food image */}
                                <ImageBackground source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${item.photos[1].name.split('/').pop()}&maxwidth=1200&key=${GOOGLE_API_KEY}` }} style={[styles.image, {overflow: 'hidden'}]}>
                                    <LinearGradient 
                                        colors={[`${colors.dark}00`, `${colors.dark}00`, `${colors.dark}CC`]} 
                                        style={[styles.image]}
                                    />
                                    <View style={{flex: 1, backgroundColor: `${colors.dark}66`}}></View>
                                </ImageBackground>

                                {/* overlay */}
                                <View style={{position: 'absolute', bottom: 15, paddingHorizontal: 20}}>

                                    {/* name */}
                                    <View style={{flexDirection: 'row', marginTop: 20}}>
                                        <Text style={{fontSize: 24, fontWeight:'bold', letterSpacing: 1.5, color: colors.light}}>{item.displayName.text}</Text>
                                    </View>
                                    
                                    {/* rating */}
                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <Rating
                                            disabled='true'
                                            size={25}
                                            rating={item.rating}
                                            fillColor='#f1c40f'
                                            baseColor='transparent'
                                            style={{alignSelf: 'flex-start'}}
                                        />
                                        <Text style={{fontSize: 18, position: 'absolute', left: (25*item.rating)+((25*.3)*(item.rating).toFixed(0))+10, marginTop: 3, color: colors.grey}}>{item.rating.toFixed(1)} ({item.userRatingCount} reviews)</Text>
                                    </View>

                                    {/* distance */}
                                    <View style={{flexDirection: 'row'}}>
                                        <CarIcon width={28} height={28} stroke={colors.grey} fill={'transparent'} strokeWidth={1.2} style={{marginTop: 5}} />
                                        <Text style={{fontSize: 16, marginLeft: 10, marginTop: 10, color: colors.grey}}>{(getDistance({ latitude: 30.323507, longitude: -95.656346 }, { latitude: item.location.latitude, longitude: item.location.longitude }, .1 )/1609.34).toFixed(1)} Miles</Text>
                                    </View>

                                    {/* open? */}
                                    <Text style={{fontSize: 18, marginTop: 5, color: item.regularOpeningHours.openNow ? colors.red : colors.green}}>{item.regularOpeningHours.openNow ? 'Closed' : 'Open Now'}</Text>
                                    

                                </View>

                                    

                            </TinderCard>
                        </View>
                    );
                })}

                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity activeOpacity={.4} onPress={() => {tinderCardsRef.current?.[index]?.swipeBack();}} style={{ alignSelf: "flex-end",}}><View style={[styles.cardButton, {borderColor: colors.yellow, width: 45, height: 45, borderRadius: 45/2, marginHorizontal: 5}]}><UndoIcon width={40} height={40} fill={colors.yellow} /></View></TouchableOpacity> */}
                    <TouchableOpacity activeOpacity={.4} onPress={() => {tinderCardsRef.current?.[cardIndexRef.current-2 < placesData.length-1-1 ? 2 : (placesData.length-1) - (cardIndexRef.current-2)]?.swipeLeft()}}><View style={[styles.cardButton, {borderColor: colors.red, width: 70, height: 70, borderRadius: 35}]}><XIcon width={65} height={65} fill={colors.red} /></View></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.4} onPress={() => {tinderCardsRef.current?.[cardIndexRef.current-2 < placesData.length-1-1 ? 2 : (placesData.length-1) - (cardIndexRef.current-2)]?.swipeTop()}}><View style={[styles.cardButton, {borderColor: colors.primary, width: 55, height: 55, borderRadius: 55/2}]}><QuestionMarkIcon width={45} height={45} fill={colors.primary} /></View></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.4} onPress={() => {tinderCardsRef.current?.[cardIndexRef.current-2 < placesData.length-1-1 ? 2 : (placesData.length-1) - (cardIndexRef.current-2)]?.swipeRight()}}><View style={[styles.cardButton, {borderColor: colors.green, width: 70, height: 70, borderRadius: 35}]}><CheckIcon width={65} height={65} fill={colors.green} /></View></TouchableOpacity>
                    {/* <View style={{width: 45, height: 45, borderRadius: 45/2, alignSelf:"flex-end", opacity: 0, marginHorizontal: 5}}><UndoIcon width={45} height={45} fill={colors.grey} /></View> */}
                </View>

            </View>

        </GestureHandlerRootView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    matchesButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8
    },
    cardContainer: {
        position: "absolute",
        left: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        position: 'relative',
        marginTop: 10,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    buttonContainer: {
        position: "absolute",
        bottom: 30,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    cardButton: {
        marginHorizontal: 10,
        flexDirection: "row",
        borderWidth: 3,
        justifyContent: "center",
        alignItems:"center"
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    overlayLabelContainer: {
        position: "absolute",
        width: 150,
        height: 80,
        borderWidth: 3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayLabelText: { fontSize: 32, fontWeight: 'bold' },

    shadow: {
        shadowColor: 'black',
        shadowOpacity: .1,
        shadowRadius: 2,
        shadowOffset: {height: 2}
    }
})

export default React.memo(Home);