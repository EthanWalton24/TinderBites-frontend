import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, SafeAreaView, Button, Alert, StatusBar, Dimensions, useColorScheme} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

import { navigationRef, navigate } from './app/RootNavigation'
import { ThemeProvider } from './app/Components/ThemeContext';
import Header from './app/Components/Header';
import LoginPage from './app/Components/LoginPage';	
import HomePage from './app/Components/HomePage';													
import MatchesPage from './app/Components/MatchesPage';
import AccountPage from './app/Components/AccountPage';
import Navbar from './app/Components/Navbar';

import { setData, getData, removeData } from './app/Components/Storage';
import colors from './app/config/colors';
import InfoPage from './app/Components/InfoPage';

import {HOST_IP, GOOGLE_API_KEY} from '@env';


const Stack = createNativeStackNavigator();


export default function App() {

	const systemTheme = useColorScheme();
	const [theme, setTheme] = useState(systemTheme);
	const primaryColor = theme === 'light' ? colors.light : colors.dark
	const contrastColor = theme === 'light' ? colors.dark : colors.light
    const secondaryColor = theme === 'light' ? colors.light2 : colors.dark2
    const greyColor = theme === 'light' ? colors.grey : colors.grey2
    const accentColor = theme === 'light' ? colors.primary : colors.primary

	const [page, setPage] = useState();
	const [matchesList, setMatchesList] = useState([]);
	const [groupMatchesList, setGroupMatchesList] = useState([]);
	
	const [useGroup, setUseGroup] = useState(false);
	const [subMenuShown, setSubMenuShown] = useState(false);

	const [placesData, setPlacesData] = React.useState([]);
    const [visibleCards, setVisibleCards] = React.useState([])
	const cardIndexRef = React.useRef(2);


	async function fetchUserSettings() {
		let token = await getData('token')
		let res = await fetch(`http://${HOST_IP}/api/Settings`, {
			method: 'GET',
			headers: {
				"Authorization": `Token ${token}`
			}
		})
		res = await res.json()
		return res
	}

	async function setUserSettings(address, radius, use_address) {
		let location = await Location.geocodeAsync(address)
		let token = await getData('token')
		await fetch(`http://${HOST_IP}/api/Settings`, {
			method: 'POST',
			headers: {
				"Authorization": `Token ${token}`
			},
			body: JSON.stringify({
				'address': address,
				'latitude': location[0].latitude,
				'longitude': location[0].longitude,
				'radius': radius,
				'use_address': use_address
			})
		})
	}

	async function fetchUserProfile() {
		let token = await getData('token')
		let res = await fetch(`http://${HOST_IP}/api/Profile`, {
			method: 'GET',
			headers: {
				"Authorization": `Token ${token}`
			}
		})
		res = await res.json()
		return res
	}

	async function setUserProfile(username, name, email) {
		let token = await getData('token')
		await fetch(`http://${HOST_IP}/api/Profile`, {
			method: 'POST',
			headers: {
				"Authorization": `Token ${token}`
			},
			body: JSON.stringify({
				'username': username,
				'name': name,
				'email': email,
			})
		})
	}


	async function fetchPlacesData(forceRefresh=false) {
        let res;
        let type = useGroup ? 'group' : 'solo';
        let token = await getData('token')
        let data = await getData(`placesData_${type}`)
        if (data == null || forceRefresh) {
			// get location 
			let location = await Location.getCurrentPositionAsync()
			//remove cached place data to test api
			await setData(`firstCardIndex_${type}`, '0')
			cardIndexRef.current = 2
			if (useGroup) {
				await setData('groupMatchesList', null)
			} else {
				await setData('matchesList', null)
			}
			//get places data from backend
            res = await fetch(`http://${HOST_IP}/api/getPlaces?type=${type}&latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Token ${token}`
                }
            })
            res = await res.json()
            await setData(`placesData_${type}`, JSON.stringify(res))
        } else {
            let firstCardIndex = await getData(`firstCardIndex_${type}`)
            res = JSON.parse(data)
            res = await res.slice(firstCardIndex) // remove the already swiped cards
            
            //remove cached place data to test api
            // await setData('firstCardIndex_solo', '0') 
            // await setData('firstCardIndex_group', '0') 
            // await setData('matchesList', null)
            // await setData('groupMatchesList', null)
            // await setData(`placesData_${type}`, null) 
            
        }
        setPlacesData(res)
        setVisibleCards(await res.slice(0,3).reverse())
		await loadMatchesData()
        return res
    }


	async function getToken() {
		var token = await getData('token')
		if (token != null) {
			setPage('Home')
			navigate('Home')
			
			// test login page
			// await removeData('token')
			// setPage('Login')
			// navigate('Login')
		} else {
			setPage('Login')
			navigate('Login')
		}
		return token;
	}
	

	async function loadMatchesData() {
		getData('matchesList').then((data) => {
			setMatchesList(data == null ? [] : data)
		})
		getData('groupMatchesList').then((data) => {
			setGroupMatchesList(data == null ? [] : data)
		})
	}
	

	const addMatchData = (matchData) => {
		if (useGroup) {
			setData('groupMatchesList', [...groupMatchesList, matchData])
			setGroupMatchesList(prevData => ([...prevData, matchData]))
		} else {
			setData('matchesList', [...matchesList, matchData])
			setMatchesList(prevData => ([...prevData, matchData]))
		}
	}


	React.useEffect(() => {
		getToken()
		loadMatchesData()
	}, [setPage])
	
	
	return (
		<ThemeProvider theme={theme} setTheme={setTheme} systemTheme={systemTheme}>
			<SafeAreaView style={{flex: 1, backgroundColor: primaryColor}}>

				<StatusBar />

				<NavigationContainer ref={navigationRef} style={{flex: 1, backgroundColor: primaryColor}}>
					
					{page != 'Login' && page != 'Info' && !subMenuShown &&
						<Header page={page} useGroup={useGroup} setUseGroup={setUseGroup} fetchPlacesData={fetchPlacesData} placesData={placesData} visibleCards={visibleCards} cardIndexRef={cardIndexRef} />
					}

					<Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false, contentStyle: {flex: 1, backgroundColor: primaryColor}, animation: "none"}}>
						<Stack.Screen name="Login">{props => <LoginPage {...props} setPage={setPage} />}</Stack.Screen>
						<Stack.Screen name="Home">{props => <HomePage {...props} setPage={setPage} matchesList={useGroup ? groupMatchesList : matchesList} addMatchData={addMatchData} useGroup={useGroup} fetchPlacesData={fetchPlacesData}  placesData={placesData} setPlacesData={setPlacesData} visibleCards={visibleCards} setVisibleCards={setVisibleCards} cardIndexRef={cardIndexRef} />}</Stack.Screen>
						<Stack.Screen name="Info" options={{gestureDirection: 'vertical', animation: 'slide_from_bottom', animationDuration: 250}}>{props => <InfoPage {...props} setPage={setPage} />}</Stack.Screen>
						<Stack.Screen name="Matches">{props => <MatchesPage {...props} matchesList={useGroup ? groupMatchesList : matchesList} />}</Stack.Screen>
						<Stack.Screen name="Account">{props => <AccountPage {...props} page={page} setSubMenuShown={setSubMenuShown} fetchUserSettings={fetchUserSettings} setUserSettings={setUserSettings} fetchUserProfile={fetchUserProfile} setUserProfile={setUserProfile} />}</Stack.Screen>
					</Stack.Navigator>

					{page != 'Login' && page != 'Info' && !subMenuShown &&
						<Navbar page={page} setPage={setPage} setSubMenuShown={setSubMenuShown} />
					}
					
				</NavigationContainer>

			</SafeAreaView>
		</ThemeProvider>		
	);
}


const styles = StyleSheet.create({


	
});