import React, {useContext, useEffect, useState, useRef} from 'react';
import { View, Text, Button, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity, ScrollView, useColorScheme, Animated, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import Toggle from "react-native-toggle-element";
import * as ImagePicker from 'expo-image-picker';

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
import { launchImageLibrary } from 'react-native-image-picker';


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

    const [profilePic, setProfilePic] = useState('')
    
    const [usernameVal, setUsernameVal] = useState('')
    const [nameVal, setNameVal] = useState('')
    const [emailVal, setEmailVal] = useState('')
    const [cityVal, setCityVal] = useState('')
    const [stateVal, setStateVal] = useState('')

    const [addressVal, setAddressVal] = useState('')
    const [radiusVal, setRadiusVal] = useState('')
	const [useAddress, setUseAddress] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false)
    const [image, setImage] = useState('')

    const [groupName, setGroupName] = useState('Group')

    const slidingPanelRef = useRef()
    const [subMenu, setSubMenu] = useState('Settings')
    const [subMenuMessage, setSubMenuMessage] = useState('')
    

    //set location permissions
    Location.getForegroundPermissionsAsync().then((d) => {
        setLocationPermission(d.granted)
    })

    
    
    useEffect(() => {
        let has_radius = false
        let has_use_address = false

        // check local storage for settings preferences, if not found request it
        getData('address').then((address) => {
            if (address) {
                setAddressVal(address)
            }
            getData('radius').then((radius) => {
                if (radius) {
                    setRadiusVal(radius)
                    has_radius = true
                }
                getData('use_address').then((use_address) => {
                    if (use_address) {
                        setUseAddress(use_address)
                        has_use_address = true
                    }

                    //get city and state from coords or address
                    handleGetCityState(address)

                    //get data from backend if not stored locally
                    if (!has_radius || !has_use_address) {
                        fetchUserSettings().then((d) => {
                            setAddressVal(d.address)
                            setData('address', d.address)
                            setRadiusVal(d.radius)
                            setData('radius', d.radius)
                            setUseAddress(d.use_address)
                            setData('use_address', d.use_address)
                        })
                    }
                })
            })
        })


        let has_username = false
        let has_email = false
        // check local storage for profile data, if not found request it
        getData('username').then((username) => {
            if (username) {
                setUsernameVal(username)
                has_username = true
            }

            getData('email').then((email) => {
                if (email) {
                    setEmailVal(email)
                    has_email = true
                }

                getData('name').then((name) => {
                    if (name) {
                        setNameVal(name)
                    }
                })

                if (!has_username || !has_email) {
                    fetchUserProfile().then((d) => {
                        setUsernameVal(d.username)
                        setData('username', d.username)
                        setEmailVal(d.email)
                        setData('email', d.email)
                        setNameVal(d.name)
                        setData('name', d.name)
                    })
                }
            })
        })
        

        getData('profilePic').then((imageURI) => {
            setImage(imageURI ? imageURI : '')
            setProfilePic(imageURI)
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


    const handleGetCityState = (address) => {
        let has_city = false
        let has_state = false
        //check for city and state stored locally, if not then geocode
        getData('city').then((city) => {
            if (city) {
                setCityVal(city)
            }

            getData('state').then((state) => {
                if (state) {
                    setStateVal(state)
                }
                
                //geocode address or current location to get city and state
                if (!has_city || !has_state) {
                    if (address) {
                        Location.geocodeAsync(address).then((d) => {
                            Location.reverseGeocodeAsync({latitude: d[0].latitude, longitude: d[0].longitude}).then((d) => {
                                setCityVal(d[0].city)
                                setStateVal(d[0].region)
                                setData('city', d[0].city)
                                setData('state', d[0].region)
                            })
                        })
                    } else {
                        Location.getCurrentPositionAsync().then((d) =>{
                            Location.reverseGeocodeAsync({latitude: d.coords.latitude, longitude: d.coords.longitude}).then((d) => {
                                setCityVal(d[0].city)
                                setStateVal(d[0].region)
                                setData('city', d[0].city)
                                setData('state', d[0].region)
                            })
                        })
                    }
                }
            })
        })
    }


    const handleSubMenuButtonPress = (button) => {
        setSubMenu(button)
        setSubMenuShown(true)
        slidingPanelRef.current.show(Dimensions.get('screen').height - 60)
    };

    const handleSubmitForm = (submenu) => {
        let success = false;
        if (submenu == 'Edit') {
            if (usernameVal == '' || nameVal == '' || emailVal == '') {
                setSubMenuMessage('Please Enter Required Fields')
            } else {
                setUserProfile(usernameVal, nameVal, emailVal)
                setProfilePic(image)
                setData('profilePic', image)
                success=true
            }
        } else {
            setUserSettings(addressVal, radiusVal, useAddress)
            success = true
        }

        if (success) {
            slidingPanelRef.current.hide(); 
            setSubMenuShown(false);
            Keyboard.dismiss();
            setSubMenuMessage('')
        }
    };

    const handleAskForPermission = (type) => {
        console.log(type, 'ADD PERMISSION FUNCTION HERE')
        if (type == 'Location') {
            Location.requestForegroundPermissionsAsync().then((d) => {console.log(d)})
        }
        if (type == 'Photos') {

        }
    }

    const handleSaveImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
            setData('profilePic', result.assets[0].uri)
        }
    }

    // const handleRemovePersonButtonPress = (person) => {
    //     console.log('remove ' + person);
    // };

    // const handleAddPersonButtonPress = () => {
    //     console.log("add person");
    // };




    return (
        <View style={{flex: 1}}>

            {/* profile */}
            <View>
                <Image source={profilePic ? {uri: profilePic} : require('../assets/ProfileImg.png')} style={styles.profilePicture} />
                <Text style={[styles.name, {color: contrastColor}]}>{usernameVal}</Text>
                <Text style={styles.location}>{cityVal}, {stateVal}</Text>
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
                            <TouchableOpacity activeOpacity={.6} style={{width: 60}} onPress={() => {slidingPanelRef.current.hide(); setSubMenuShown(false); setSubMenuMessage(''); setImage(profilePic)}}>
                                <Text style={{fontSize: 17, color: contrastColor}}>Cancel</Text>
                            </TouchableOpacity>
                            
                            {/* menu label */}
                            <Text style={{color: contrastColor, fontSize: 24}}>{subMenu == 'Group' ? groupName : subMenu}</Text>
                            
                            {/* done button */}
                            <TouchableOpacity activeOpacity={.6} style={{width: 60, alignItems: 'flex-end'}} onPress={() => {handleSubmitForm(subMenu)}}>
                                <Text style={{fontSize: 17, color: accentColor}}>Done</Text>
                            </TouchableOpacity> 
                        </View>

                        {subMenuMessage != '' && 
                            <View style={{alignItems: 'center', paddingVertical: 3, backgroundColor: colors.red}}>
                                <Text style={{color: contrastColor, fontSize: 14}}>{subMenuMessage}</Text>
                            </View>
                        }
                        
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
                            </View>
                        </View>

                        {/* edit profile sub-menu */}
                        <View style={{display: subMenu === "Edit" ? "flex" : "none"}}>
                            {/* change image section */}
                            <View style={{height: 150, borderBottomWidth: 1, borderBottomColor: secondaryColor, justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity style={{height: '100%'}} onPress={() => handleSaveImage()}>
                                    <View style={{alignItems: 'center'}}>
                                        <Image source={image ? {uri: image} : require('../assets/ProfileImg.png')} style={{height: 110, aspectRatio: 1, marginTop: 10, borderRadius: '50%'}} />
                                        <Text style={{marginVertical: 6, fontSize: 12, color: contrastColor}}>Change Profile Picture</Text>
                                    </View>
                                </TouchableOpacity>
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