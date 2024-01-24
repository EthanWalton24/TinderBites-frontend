import React, {useContext, useEffect, useState} from 'react';
import { View, Text, Button, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity, ScrollView, useColorScheme, Animated, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Image } from 'expo-image';
import {launchImageLibrary} from 'react-native-image-picker';
import * as Location from 'expo-location';
import Toggle from "react-native-toggle-element";

import { setData, getData, removeData } from './Storage';

import GearIcon from '../assets/GearIcon.svg';
import GroupIcon from '../assets/GroupIcon.svg';
import PencilIcon from '../assets/PencilIcon.svg';
import XIcon from '../assets/XIcon.svg';
import TrashIcon from '../assets/TrashIcon.svg';
import PlusIcon from '../assets/PlusIcon.svg';
import ArrowIcon from '../assets/ArrowIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';


// get location 
// Location.getCurrentPositionAsync()
// .then((l) => {
    //     console.log(l)
// })
//geocode    
// Location.geocodeAsync('1550 Crescent Pointe Pkwy').then((d) => {console.log(d)})
// Location.reverseGeocodeAsync({latitude: 30.6450273, longitude: -96.2938544}).then((d) => {console.log(d)})


function Account({ navigation, page, setSubMenuShown, fetchUserSettings, setUserSettings, fetchUserProfile, setUserProfile}) {

    const { theme, toggleTheme } = useContext(ThemeContext);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary
    
    const [usernameVal, setUsernameVal] = React.useState('')
    const [nameVal, setNameVal] = React.useState('')
    const [emailVal, setEmailVal] = React.useState('')
    const [cityVal, setCityVal] = React.useState('')
    const [stateVal, setStateVal] = React.useState('')

    const [addressVal, setAddressVal] = React.useState('')
    const [radiusVal, setRadiusVal] = React.useState('')
	const [useAddress, setUseAddress] = useState(false);
    const [locationPermission, setLocationPermission] = React.useState(false)
    const [photosPermission, setPhotosPermission] = React.useState(false)

    const [groupName, setGroupName] = useState('Group')

    const slidingPanelRef = React.useRef()
    const [subMenu, setSubMenu] = useState('Settings')
    

    //set location permissions
    Location.getForegroundPermissionsAsync().then((d) => {
        setLocationPermission(d.granted)
    })

    
    
    useEffect(() => {
        fetchUserSettings().then((d) => {
            setAddressVal(d.address)
            setRadiusVal(d.radius)
            setUseAddress(d.use_address)
        })

        fetchUserProfile().then((d) => {
            setUsernameVal(d.username)
            setEmailVal(d.email)
            setNameVal(d.name)
        })


        getData('city').then((city) => {
            setCityVal(city ? city : '')
        })
        getData('state').then((state) => {
            setStateVal(state ? state : '')
        })

        // getData('groupName').then((groupName) => {
        //     if (groupName != null) {
        //         setGroupName(groupName)
        //     }
        // })
    }, [subMenu])


    useEffect(() => {
        slidingPanelRef.current.hide()
        setSubMenuShown(false)
    }, [page])



    const handleSubMenuButtonPress = (button) => {
        setSubMenu(button)
        setSubMenuShown(true)
        slidingPanelRef.current.show(Dimensions.get('screen').height - 60)
    };

    const handleSubmitForm = (submenu) => {
        if (submenu == 'Edit') {
            console.log(usernameVal, nameVal, emailVal, cityVal, stateVal)
            setUserProfile(usernameVal, nameVal, emailVal)
        } else {
            setUserSettings(addressVal, radiusVal, useAddress)
        }
        slidingPanelRef.current.hide(); 
        setSubMenuShown(false);
        Keyboard.dismiss();
    };

    const handleAskForPermission = (type) => {
        console.log(type, 'ADD PERMISSION FUNCTION HERE')
        if (type == 'Location') {
            Location.requestForegroundPermissionsAsync().then((d) => {console.log(d)})
        }
        if (type == 'Photos') {

        }
    }

    const handleRemovePersonButtonPress = (person) => {
        console.log('remove ' + person);
    };

    const handleAddPersonButtonPress = () => {
        console.log("add person");
    };




    return (
        <View style={{flex: 1}}>

            {/* profile */}
            <View>
                <Image source={require('../assets/ProfilePic.jpg')} style={styles.profilePicture} />
                <Text style={[styles.name, {color: contrastColor}]}>{usernameVal}</Text>
                <Text style={styles.location}>College Station, TX</Text>
            </View>

            {/* buttons */}
            <View style={styles.buttonContainer}>

                {/* edit profile button */}
                <View style={{width: 100, alignItems: "center"}}>
                <TouchableHighlight activeOpacity={.5} underlayColor={primaryColor} onPress={() => handleSubMenuButtonPress("Edit")}><View style={styles.circleContainer}><PencilIcon width={30} height={30} fill={colors.grey} /></View></TouchableHighlight>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </View>

                {/* group button */}
                {/* <View style={{width: 100, alignItems: "center", marginTop: 30}}>
                    <TouchableHighlight activeOpacity={.65} underlayColor={primaryColor} onPress={() => handleSubMenuButtonPress("Group")}><LinearGradient colors={[colors.primary, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.circleContainer, {width: 60, height: 60, borderRadius: 30,}]}><GroupIcon width={35} height={35} fill={colors.light} /></LinearGradient></TouchableHighlight>
                    <Text style={styles.buttonText}>Group</Text>
                </View> */}

                {/* settings button */}
                <View style={{width: 100, alignItems: "center"}}>
                    <TouchableHighlight activeOpacity={.5} underlayColor={primaryColor} onPress={() => handleSubMenuButtonPress("Settings")}><View style={styles.circleContainer}><GearIcon width={30} height={30} fill={colors.grey} /></View></TouchableHighlight>
                    <Text style={styles.buttonText}>Settings</Text>
                </View>

            </View>


            {/* sub-menus */}
            <SlidingUpPanel friction={.9} ref={slidingPanelRef} containerStyle={{backgroundColor: primaryColor, paddingTop: 20}} animatedValue={new Animated.Value(0)} allowDragging={false}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                    <View style={{flex: 1}}>

                        {/* close sub-menu button */}
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: greyColor+'4D'}}>
                            {/* cancel button */}
                            <TouchableOpacity activeOpacity={.6} style={{width: 60}} onPress={() => {slidingPanelRef.current.hide(); setSubMenuShown(false)}}>
                                <Text style={{fontSize: 17, color: contrastColor}}>Cancel</Text>
                            </TouchableOpacity>
                            
                            {/* menu label */}
                            <Text style={{color: contrastColor, fontSize: 24}}>{subMenu == 'Group' ? groupName : subMenu}</Text>
                            
                            {/* done button */}
                            <TouchableOpacity activeOpacity={.6} style={{width: 60, alignItems: 'flex-end'}} onPress={() => {handleSubmitForm(subMenu)}}>
                                <Text style={{fontSize: 17, color: accentColor}}>Done</Text>
                            </TouchableOpacity> 
                        </View>
                        
                        {/* settings sub-menu */}
                        <View style={{display: subMenu === "Settings" ? "flex" : "none", padding: 15, paddingRight: 8}}>
                            {/* general */}
                            <View style={{marginTop: 10, marginBottom: 40}}>
                                <Text style={{color: greyColor, fontSize: 16, marginBottom: 10}} >General</Text>

                                <View style={{flexDirection: 'row', marginVertical: 10}}>
                                    <Text style={{color: contrastColor, fontSize: 16, flex: 1}}>Address</Text>
                                    <TextInput style={{width: "60%", color: contrastColor, fontSize: 16, borderBottomWidth: 1, borderBottomColor: secondaryColor,}} defaultValue={`${addressVal}`} autoComplete='off' onChangeText={(newText) => setAddressVal(newText)} />
                                </View>

                                <View style={{flexDirection: 'row', marginVertical: 10}}>
                                    <Text style={{color: contrastColor, fontSize: 16, flex: 1}}>Place Radius</Text>
                                    <TextInput style={{width: 30, color: contrastColor, fontSize: 16, borderBottomWidth: 1, borderBottomColor: secondaryColor, textAlign: 'center'}} defaultValue={`${radiusVal}`} maxLength={2} onChangeText={(newText) => setRadiusVal(newText)} keyboardType='numeric' />
                                    <Text style={{color: contrastColor, fontSize: 16, marginHorizontal: 5}}>mi</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginVertical: 10, paddingRight: 5}}>
                                    <Text style={{color: contrastColor, fontSize: 16, flex: 1}}>Use Address</Text>
                                    <Toggle 
                                    // containerStyle={styles.switchContainer}
                                    thumbButton={{width: 20, height: 20, activeBackgroundColor: accentColor, inActiveBackgroundColor: accentColor}}
                                    trackBar={{activeBackgroundColor: `${accentColor}66`, inActiveBackgroundColor: secondaryColor, width: 40, height: 20}}
                                    value={useAddress} 
                                    onPress={() => {
                                        setUseAddress(prevVal => !prevVal)
                                    }} 
                                    animationDuration={250}
                                    />
                                </View>
                            </View>
                            
                            {/* permissions */}
                            <View>
                                <Text style={{color: greyColor, fontSize: 16, marginBottom: 10}} >App Permissions</Text>

                                <View style={{flexDirection: 'row', marginVertical: 10}}>
                                    <Text style={{color: contrastColor, fontSize: 16, flex: 1}}>Location Services</Text>
                                    <TouchableOpacity onPress={() => handleAskForPermission('Location')}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{color: greyColor, fontSize: 16, paddingRight: 8}}>{locationPermission ? 'While Using' : 'Not Allowed'}</Text>
                                            { !locationPermission && 
                                                <ArrowIcon style={{transform: [{rotate: '90deg'}, {scaleX: .9}]}} width={20} height={20} fill={contrastColor} />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection: 'row', marginVertical: 10}}>
                                    <Text style={{color: contrastColor, fontSize: 16, flex: 1}}>Photos</Text>
                                    <TouchableOpacity onPress={() => handleAskForPermission('Photos')}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{color: greyColor, fontSize: 16, paddingRight: 8}}>{photosPermission ? 'While Using' : 'Not Allowed'}</Text>
                                            { !photosPermission && 
                                                <ArrowIcon style={{transform: [{rotate: '90deg'}, {scaleX: .9}]}} width={20} height={20} fill={contrastColor} />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* edit profile sub-menu */}
                        <View style={{display: subMenu === "Edit" ? "flex" : "none"}}>
                            {/* change image section */}
                            <View style={{height: 150, borderBottomWidth: 1, borderBottomColor: secondaryColor}}>

                            </View>

                            {/* change details section */}
                            <View style={{borderBottomWidth: 1, borderBottomColor: secondaryColor}}>
                                <View style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal: 15}}>
                                    <Text style={{width: 80, color: contrastColor, fontSize: 16}}>Username</Text>
                                    <TextInput style={{flex: 1, color: contrastColor, fontSize: 16, marginLeft: 10, borderBottomWidth: 1, borderBottomColor: secondaryColor, paddingBottom: 10}} onChangeText={(newText) => {setUsernameVal(newText)}} autoComplete="off" autoCapitalize='none' defaultValue={usernameVal} placeholder='Username' autoCorrect={false} keyboardType="default"  />
                                </View>

                                <View style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal: 15}}>
                                    <Text style={{width: 80, color: contrastColor, fontSize: 16}}>Name</Text>
                                    <TextInput style={{flex: 1, color: contrastColor, fontSize: 16, marginLeft: 10, borderBottomWidth: 1, borderBottomColor: secondaryColor, paddingBottom: 10}} onChangeText={(newText) => {setNameVal(newText)}} autoComplete="off" autoCapitalize='none' defaultValue={nameVal} placeholder='Full Name' autoCorrect={false} keyboardType="default"  />
                                </View>

                                <View style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal: 15}}>
                                    <Text style={{width: 80, color: contrastColor, fontSize: 16}}>Email</Text>
                                    <TextInput style={{flex: 1, color: contrastColor, fontSize: 16, marginLeft: 10, borderBottomWidth: 1, borderBottomColor: secondaryColor, paddingBottom: 10}} onChangeText={(newText) => {setEmailVal(newText)}} autoComplete="off" autoCapitalize='none' defaultValue={emailVal} placeholder='Email' autoCorrect={false} keyboardType="email-address"  />
                                </View>
                                
                                <View style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal: 15}}>
                                    <Text style={{width: 80, color: contrastColor, fontSize: 16}}>City</Text>
                                    <TextInput style={{flex: 1, color: contrastColor, fontSize: 16, marginLeft: 10, borderBottomWidth: 1, borderBottomColor: secondaryColor, paddingBottom: 10}} onChangeText={(newText) => {setCityVal(newText)}} autoComplete="off" autoCapitalize='none' defaultValue={cityVal} placeholder='City' autoCorrect={false} keyboardType="default"  />
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 5, paddingHorizontal: 15}}>
                                    <Text style={{width: 80, color: contrastColor, fontSize: 16}}>State</Text>
                                    <TextInput style={{flex: 1, color: contrastColor, fontSize: 16, marginLeft: 10, paddingBottom: 10}} onChangeText={(newText) => {setStateVal(newText)}} maxLength={2} autoComplete="off" autoCapitalize="characters" defaultValue={stateVal} placeholder='State Code' autoCorrect={false} keyboardType="default"  />
                                </View>
                            </View>
                        </View>

                        {/* group sub-menu */}
                        {/* <ScrollView contentContainerStyle={{display: subMenu === "Group" ? "flex" : "none", flexDirection: "row", flexWrap: "wrap"}}>
                            
                            <View style={[styles.groupContainer, {borderColor: greyColor}]}>
                                <TouchableOpacity activeOpacity={.6} onPress={() => handleRemovePersonButtonPress('Ethan Walton')}  style={styles.groupRemove}><TrashIcon width={30} height={30} fill={primaryColor} stroke={colors.red} strokeWidth={2} /></TouchableOpacity>
                                <Image source={require('../assets/ProfilePic.jpg')} style={styles.groupPicture} />
                                <Text style={[styles.groupName, {color: contrastColor}]}>Ethan Walton</Text>
                            </View>

                            <TouchableOpacity activeOpacity={.6} style={[styles.groupContainer, {borderColor: greyColor}]} onPress={() => handleAddPersonButtonPress()}>
                                <PlusIcon stroke={contrastColor} style={styles.groupPicture} width={((Dimensions.get('screen').width - 40) / 2) * .65} height={((Dimensions.get('screen').width - 40) / 2) * .65} />
                                <Text style={[styles.groupName, {color: contrastColor}]}>Add Person</Text>
                            </TouchableOpacity>
                        </ScrollView>  */}

                    </View>
                </TouchableWithoutFeedback>
            </SlidingUpPanel>
        </View>
    );
}

const styles = StyleSheet.create({

    profilePicture: {
        alignSelf: "center",
        marginTop: 40,
        width: 150,
        height: 150,
        borderRadius: 75
    },

    name: {
        alignSelf: "center",
        marginTop: 15,
        fontSize: 20,
        fontWeight: "bold",
    },

    location: {
        alignSelf: "center",
        marginTop: 5,
        fontSize: 15,
        color: colors.grey
    },

    buttonContainer: {
        marginTop: 50,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around"
    },

    circleContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 55,
        height: 55,
        borderRadius: 55/2,
        borderColor: colors.grey,
        borderWidth: 1,
    },

    buttonText: {
        marginTop: 10,
        color: colors.grey
    },

    groupContainer: {
        marginTop: 20,
        margin: 9,
        alignContent: "center",
        justifyContent: "center",
        width: ((Dimensions.get('screen').width - 40) / 2),
        aspectRatio: 3 / 4,
        borderWidth: 1,
        borderRadius: 20,
    },

    groupRemove: {
        position: "absolute",
        top: 5,
        right: 5
    },

    groupPicture: {
        alignSelf: "center",
        width: ((Dimensions.get('screen').width - 40) / 2) * .65,
        height: ((Dimensions.get('screen').width - 40) / 2) * .65,
        borderRadius: ((Dimensions.get('screen').width - 40) / 2) * .325
    },

    groupName: {
        alignSelf: "center",
        marginTop: 10,
        fontSize: 14,
        fontWeight: "bold",
    }
})

export default React.memo(Account);