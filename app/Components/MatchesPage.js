import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, Dimensions, RefreshControl, Animated, TouchableHighlight, TouchableOpacity, Linking } from 'react-native';
import { ImageBackground, Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import ProgressBar from 'react-native-animated-progress';

import NextIcon from '../assets/NextIcon.svg';
import ArrowIcon from '../assets/ArrowIcon.svg';
import DiceIcon from '../assets/DiceIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';
import CarouselItem from './CarouselItem';

import {GOOGLE_API_KEY} from '@env';
import InfoPage from './InfoPage';
import { LinearGradient } from 'expo-linear-gradient';



function Matches({ matchesList }) {

    const {theme, toggleTheme} = useContext(ThemeContext);
    const primaryColor = theme === 'light' ? colors.light : colors.dark
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const contrastColor = theme === 'light' ? colors.dark : colors.light
    const accentColor = theme === 'light' ? colors.primary : colors.primary

    const glowOpacity = useRef(new Animated.Value(0)).current
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
    }, []);

    const carouselRef = React.useRef()
    const carouselItemsRef = React.useRef(Array(matchesList.length).fill(null))

    const [carouselIndex, setCarouselIndex] = React.useState(1);
    const [selectedPlaceData, setSelectedPlaceData] = React.useState(matchesList[0]?.data);


    const handleMoveCarousel = (dir) => {

        if (dir == 1) {
            setCarouselIndex(ind => {
                if (ind+1 > matchesList.length) {
                    return 1
                } else {
                    return ind+1
                }
            });
            carouselRef.current?.next()
            setRefreshing(true)
            setTimeout(()=>{setRefreshing(false)}, 500)
        } else {
            setCarouselIndex(ind => {
                if (ind-1 < 1) {
                    return matchesList.length
                } else {
                    return ind-1
                }
            });
            carouselRef.current?.prev()
            setRefreshing(true)
            setTimeout(()=>{setRefreshing(false)}, 500)
        }

    }


    

    const handlePickRandomPlace = () => {
        carouselItemsRef.current[carouselRef.current?.getCurrentIndex()].glowOff()
        setRefreshing(true)
        //amount of times to spin (chooses random place)
        let ind = Math.floor( Math.random() * (matchesList.length+1) )
        let num = ind + matchesList.length * 2
        
        //spin carousel
        let dist;
        let total_time = 0;
        Array(num).fill().map((x,i) => {

            if (num - i < 5) {
                dist = 5 - (num - i)
                total_time += dist*100
                setTimeout(() => {
                    carouselRef.current?.next()
                }, dist*100 + (i*100));
            } else if (5 - i > 0) {
                dist = 5 - i
                total_time += dist*100
                setTimeout(() => {
                    carouselRef.current?.next()
                }, dist*100 + (i*100));
            } else {
                total_time += 100
                setTimeout(() => {
                    carouselRef.current?.next()
                }, 100 + (i*100));
            }
        });

        //create glow effect
        setTimeout(() => {
            carouselItemsRef.current[carouselRef.current?.getCurrentIndex()].glowOn()
        }, total_time-200);

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
                        // loop={false}
                        ref={carouselRef}
                        width={Dimensions.get('window').width}
                        height={Dimensions.get('window').height - 410}
                        data={matchesList}
                        mode='parallax'
                        modeConfig={{
                            parallaxScrollingOffset: 80
                        }}
                        scrollAnimationDuration={750}
                        onSnapToItem={(index) => {setSelectedPlaceData(matchesList[index].data); setCarouselIndex(index+1); setRefreshing(false)}}
                        renderItem={({index, item}) => (
                            <CarouselItem ref={(ele) => carouselItemsRef.current[index] = ele} imgURI={`${item.data.photos[0].prefix}original${item.data.photos[0].suffix}`} name={item.data.name} glowOpacity={React.useRef(new Animated.Value(0)).current}></CarouselItem>
                            // <Animated.View ref={(ele) => {carouselItemsRef.current[index] = ele}} style={{width: '85%', marginHorizontal: '7.5%'}}>
                            //     <Image style={{width: '100%', aspectRatio: 1/1.15, borderRadius: 20}} source={{uri: `${item.data.photos[0].prefix}original${item.data.photos[0].suffix}`}} key={item.data.name} />
                            //     <Text style={{marginTop: 30, color: contrastColor, fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{item.data.name}</Text>
                            // </Animated.View>
                        )}
                    />

                    {/* carousel navigation */}
                    <View style={{marginHorizontal: 30, justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                            <TouchableOpacity activeOpacity={.5} onPress={() => {!refreshing ? handleMoveCarousel(-1) : null}}><NextIcon width={35} height={35} stroke={greyColor} strokeWidth={1.2} style={{marginTop: 5, transform: [{rotateY: '180deg'}]}} /></TouchableOpacity >
                            <TouchableOpacity activeOpacity={.5} onPress={() => {!refreshing ? handlePickRandomPlace() : null}}><DiceIcon width={28} height={28} fill={greyColor} strokeWidth={1.2} style={{marginTop: 10}} /></TouchableOpacity >
                            <TouchableOpacity activeOpacity={.5} onPress={() => {!refreshing ? handleMoveCarousel(1) : null}}><NextIcon width={35} height={35} stroke={greyColor} strokeWidth={1.2} style={{marginTop: 5}} /></TouchableOpacity >
                        </View>
                        
                        <ProgressBar
                            progress={((carouselIndex) / matchesList.length) * 100}
                            progressDuration={500}
                            height={6}
                            backgroundColor={accentColor}
                            trackColor={secondaryColor}
                            animated={true}
                        />

                        <Text style={{marginTop: 10, color:greyColor, fontSize: 16, textAlign: 'right', letterSpacing: 1.5}}>{(carouselIndex)}/{matchesList.length}</Text>
                    </View>
                </View>

                {/* info page */}
                <LinearGradient colors={[secondaryColor+'66', primaryColor+'66', primaryColor]} style={{minHeight: Dimensions.get('window').height - 50, width: '100%', backgroundColor: secondaryColor+'66', borderTopLeftRadius: 40, borderTopRightRadius: 40}}>
                        
                        {/* header */}
                        <View style={{alignItems: 'center', paddingTop: 5, height: 80}}>
                            <ArrowIcon width={40} height={35} fill={greyColor} />
                            <Text style={{fontSize: 20, color: greyColor}}>See More</Text>
                        </View>

                        <InfoPage placeData={selectedPlaceData} />

                    {/* add padding to bottom of scrollview */}
                    <View style={{height: 50}}></View>
                
                </LinearGradient>


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