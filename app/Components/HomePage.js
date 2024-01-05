import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TinderCard } from 'rn-tinder-card';
import { Rating } from '@kolking/react-native-rating';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { getDistance } from 'geolib';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';

import UndoIcon from '../assets/UndoIcon.svg';
import XIcon from '../assets/XIcon.svg';
import QuestionMarkIcon from '../assets/QuestionMarkIcon.svg';
import CheckIcon from '../assets/CheckIcon.svg';
import CarIcon from '../assets/CarIcon.svg';
import InfoIcon from '../assets/InfoIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';
import { setData, getData, removeData } from './Storage';

import {HOST_IP, GOOGLE_API_KEY} from '@env';

// request location
Location.requestForegroundPermissionsAsync()

// get location 
// Location.getCurrentPositionAsync()
// .then((l) => {
//     console.log(l)
// })


function Home({ navigation, addMatchData, setPage, useGroup, setSubMenuShown }) {

    const { theme, toggleTheme } = useContext(ThemeContext);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary
    
    const tinderCardsRef = React.useRef([]);
    const cardIndexRef = React.useRef(2);

    const [placesData, setPlacesData] = React.useState([]);
    const [visibleCards, setVisibleCards] = React.useState([])


    async function fetchPlacesData() {
        let res;
        let type = useGroup ? 'group' : 'solo';
        let token = await getData('token')
        let data = await getData(`placesData_${type}`)
        if (data == null) {
            res = await fetch(`http://${HOST_IP}/api/getPlaces?type=${type}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Token ${token}`
                }
            })
            res = await res.json()
            await setData(`placesData_${type}`, JSON.stringify(res))
            await setData(`firstCardIndex_${type}`, '0')
        } else {
            let firstCardIndex = await getData(`firstCardIndex_${type}`)
            res = JSON.parse(data)
            res = res.slice(firstCardIndex) // remove the already swiped cards
            
            //remove cached place data to test api
            await setData('firstCardIndex_solo', '0') 
            await setData('firstCardIndex_group', '0') 
            await setData('matchesList', null)
            await setData('groupMatchesList', null)
            await setData(`placesData_${type}`, null) 
            
        }
        await setPlacesData(res)
        setVisibleCards(await res.slice(0,3).reverse())
        return res
    }

    useEffect(() => {
        fetchPlacesData()
    }, [useGroup])


    const renderNextCard = () => {
        const newCard = placesData[cardIndexRef.current]
        setVisibleCards(cards => [newCard, ...cards.splice(0,3)])
    }


    const handleSwipe = async (data) => {
        setData(`firstCardIndex_${useGroup ? 'group' : 'solo'}`, `${cardIndexRef.current-1}`)//next card (card after the one that just got swiped)
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
                marginTop: (Dimensions.get('screen').height - 560),
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
    
            <View style={[styles.container, {backgroundColor: primaryColor}]}>
                <View style={styles.centered}>
                    <Text style={{fontSize: 25, color: contrastColor}}>That is all!</Text>
                    <TouchableOpacity style={[styles.matchesButton, {backgroundColor: contrastColor}]} onPress={() => {setPage('Matches');navigation.navigate("Matches");}}><Text style={{color: primaryColor, fontSize: 20}}>Matches</Text></TouchableOpacity>
                </View>
                

                {/* cards */}
                {visibleCards.map((item, index) => {
                    // console.log(item)
                    return (
                        <View style={[styles.cardContainer]} pointerEvents="box-none" key={item.name}>
                            <TinderCard
                            key={item.name}
                            ref={(el) => (tinderCardsRef.current[index] = el)}
                            cardWidth={Dimensions.get('screen').width - 18}
                            cardHeight={Dimensions.get('screen').height - 310}
                            OverlayLabelRight={OverlayRight}
                            OverlayLabelLeft={OverlayLeft}
                            OverlayLabelTop={OverlayTop}
                            cardStyle={[styles.card, styles.shadow, {backgroundColor: contrastColor}]}
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
                                <ImageBackground source={{ uri: `${item.photos[0].prefix}original${item.photos[0].suffix}` }} style={[styles.image, {overflow: 'hidden'}]}>
                                    <LinearGradient 
                                        colors={[`${colors.dark}00`, `${colors.dark}00`, `${colors.dark}CC`]} 
                                        style={[styles.image]}
                                    />
                                    <View style={{flex: 1, backgroundColor: `${colors.dark}66`}}></View>
                                </ImageBackground>

                                {/* overlay */}
                                <View style={{width: Dimensions.get('screen').width - 18, position: 'absolute', bottom: 15, paddingHorizontal: 20}}>

                                    {/* name */}
                                    <View style={{flexDirection: 'row', marginTop: 20}}>
                                        <Text style={{fontSize: 24, fontWeight:'bold', letterSpacing: 1.5, color: colors.light}}>{item.name}</Text>
                                    </View>
                                    
                                    {/* rating */}
                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <Rating
                                            disabled='true'
                                            size={25}
                                            rating={((item.rating/2).toFixed(1))}
                                            fillColor='#f1c40f'
                                            baseColor='transparent'
                                            style={{alignSelf: 'flex-start'}}
                                        />
                                        <Text style={{fontSize: 18, position: 'absolute', left: (25*((item.rating/2).toFixed(1)))+((25*.3)*((item.rating/2).toFixed(1)))+10, marginTop: 3, color: greyColor}}>{((item.rating/2).toFixed(1))}</Text>
                                    </View>


                                    
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                        <View>
                                            {/* distance */}
                                            <View style={{flexDirection: 'row'}}>
                                                <CarIcon width={28} height={28} stroke={greyColor} fill={'transparent'} strokeWidth={1.2} style={{marginTop: 5}} />
                                                <Text style={{fontSize: 16, marginLeft: 10, marginTop: 10, color: greyColor}}>{(item.distance/1609.34).toFixed(1)} Miles</Text>
                                            </View>

                                            {/* open? */}
                                            <Text style={{fontSize: 18, marginTop: 5, color: item.hours?.open_now ? colors.red : colors.green}}>{item.hours?.open_now ? 'Closed' : 'Open Now'}</Text>
                                        </View>

                                        {/* info button */}
                                        <TouchableOpacity onPress={() => {navigation.navigate('Info', { selectedPlaceData: item }); setPage('Info')}}>
                                            <InfoIcon width={35} height={35} fill={colors.light}/>
                                        </TouchableOpacity>
                                    </View>
                                    

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
                    {/* <View style={{width: 45, height: 45, borderRadius: 45/2, alignSelf:"flex-end", opacity: 0, marginHorizontal: 5}}><UndoIcon width={45} height={45} fill={greyColor} /></View> */}
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