import React, {useContext, useEffect, useState} from 'react';
import { View, Text, Button, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity, ScrollView, useColorScheme, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Image } from 'expo-image';
import {launchImageLibrary} from 'react-native-image-picker';

import { setData, getData, removeData } from './Storage';

import GearIcon from '../assets/GearIcon.svg';
import GroupIcon from '../assets/GroupIcon.svg';
import PencilIcon from '../assets/PencilIcon.svg';
import XIcon from '../assets/XIcon.svg';
import TrashIcon from '../assets/TrashIcon.svg';
import PlusIcon from '../assets/PlusIcon.svg';

import ThemeContext from './ThemeContext';
import colors from '../config/colors';



function Account({ navigation, page, setSubMenuShown}) {

    const { theme, toggleTheme } = useContext(ThemeContext);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary

    const [username, setUsername] = React.useState('')
    const [groupName, setGroupName] = useState('Group')

    const slidingPanelRef = React.useRef()
    const [subMenu, setSubMenu] = useState('Settings')
    


    useEffect(() => {
        getData('username').then((username) => {
            setUsername(username)
        })
        getData('groupName').then((groupName) => {
            if (groupName != null) {
                setGroupName(groupName)
            }
        })
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
                <Text style={[styles.name, {color: contrastColor}]}>{username}</Text>
                <Text style={styles.location}>College Station, TX</Text>
            </View>

            {/* buttons */}
            <View style={styles.buttonContainer}>
                
                {/* settings button */}
                <View style={{width: 100, alignItems: "center"}}>
                    <TouchableHighlight activeOpacity={.5} underlayColor={primaryColor} onPress={() => handleSubMenuButtonPress("Settings")}><View style={styles.circleContainer}><GearIcon width={30} height={30} fill={colors.grey} /></View></TouchableHighlight>
                    <Text style={styles.buttonText}>Settings</Text>
                </View>
                
                {/* group button */}
                <View style={{width: 100, alignItems: "center", marginTop: 30}}>
                    <TouchableHighlight activeOpacity={.65} underlayColor={primaryColor} onPress={() => handleSubMenuButtonPress("Group")}><LinearGradient colors={[colors.primary, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.circleContainer, {width: 60, height: 60, borderRadius: 30,}]}><GroupIcon width={35} height={35} fill={colors.light} /></LinearGradient></TouchableHighlight>
                    <Text style={styles.buttonText}>Group</Text>
                </View>

                {/* edit profile button */}
                <View style={{width: 100, alignItems: "center"}}>
                <TouchableHighlight activeOpacity={.5} underlayColor={primaryColor} onPress={() => handleSubMenuButtonPress("Edit")}><View style={styles.circleContainer}><PencilIcon width={30} height={30} fill={colors.grey} /></View></TouchableHighlight>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </View>
            </View>


            {/* sub-menus */}
            <SlidingUpPanel friction={.9} ref={slidingPanelRef} containerStyle={{backgroundColor: primaryColor, paddingTop: 20}} animatedValue={new Animated.Value(0)} allowDragging={false}>
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
                        <TouchableOpacity activeOpacity={.6} style={{width: 60, alignItems: 'flex-end'}} onPress={() => {slidingPanelRef.current.hide(); setSubMenuShown(false)}}>
                            <Text style={{fontSize: 17, color: accentColor}}>Done</Text>
                        </TouchableOpacity> 
                    </View>
                    
                    {/* settings sub-menu */}
                    <View style={{display: subMenu === "Settings" ? "flex" : "none"}}>
                        <GearIcon height={50} width={50} fill={contrastColor} />
                    </View>

                    {/* edit profile sub-menu */}
                    <View style={{display: subMenu === "Edit" ? "flex" : "none"}}>
                        <PencilIcon height={50} width={50} fill={contrastColor} />
                    </View>

                    {/* group sub-menu */}
                    <ScrollView contentContainerStyle={{display: subMenu === "Group" ? "flex" : "none", flexDirection: "row", flexWrap: "wrap"}}>
                        
                        <View style={[styles.groupContainer, {borderColor: greyColor}]}>
                            <TouchableOpacity activeOpacity={.6} onPress={() => handleRemovePersonButtonPress('Ethan Walton')}  style={styles.groupRemove}><TrashIcon width={30} height={30} fill={primaryColor} stroke={colors.red} strokeWidth={2} /></TouchableOpacity>
                            <Image source={require('../assets/ProfilePic.jpg')} style={styles.groupPicture} />
                            <Text style={[styles.groupName, {color: contrastColor}]}>Ethan Walton</Text>
                        </View>

                        <TouchableOpacity activeOpacity={.6} style={[styles.groupContainer, {borderColor: greyColor}]} onPress={() => handleAddPersonButtonPress()}>
                            <PlusIcon stroke={contrastColor} style={styles.groupPicture} width={((Dimensions.get('screen').width - 40) / 2) * .65} height={((Dimensions.get('screen').width - 40) / 2) * .65} />
                            <Text style={[styles.groupName, {color: contrastColor}]}>Add Person</Text>
                        </TouchableOpacity>
                    </ScrollView> 

                </View>
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
        justifyContent: "center"
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