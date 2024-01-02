import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, SafeAreaView, Button, Alert, StatusBar, Dimensions, useColorScheme} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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


	React.useEffect(() => {
		getToken()
        // .then((token) => {
        //     console.log(token)
        // })
    }, [setPage])


	const addMatchData = (matchData) => {
		setMatchesList(prevData => ([...prevData, matchData]))
	}


	return (
		<ThemeProvider theme={theme} setTheme={setTheme} systemTheme={systemTheme}>
			<SafeAreaView style={{flex: 1, backgroundColor: primaryColor}}>

			<StatusBar />

			<NavigationContainer ref={navigationRef} style={{flex: 1, backgroundColor: primaryColor}}>
				
				{page != 'Login' && !subMenuShown &&
					<Header page={page} useGroup={useGroup} setUseGroup={setUseGroup} />
				}

				<Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false, contentStyle: {flex: 1, backgroundColor: primaryColor}, animation: "none"}}>
					<Stack.Screen name="Login">{props => <LoginPage {...props} setPage={setPage} />}</Stack.Screen>
					<Stack.Screen name="Home">{props => <HomePage {...props} setPage={setPage} matchesList={matchesList} addMatchData={addMatchData} />}</Stack.Screen>
					<Stack.Screen name="Info" options={{gestureDirection: 'vertical', animation: 'slide_from_bottom', animationDuration: 250}}>{props => <InfoPage {...props} />}</Stack.Screen>
					<Stack.Screen name="Matches">{props => <MatchesPage {...props} matchesList={matchesList} />}</Stack.Screen>
					<Stack.Screen name="Account">{props => <AccountPage {...props} page={page} setSubMenuShown={setSubMenuShown} />}</Stack.Screen>
				</Stack.Navigator>

				{page != 'Login' &&
					<Navbar page={page} setPage={setPage} setSubMenuShown={setSubMenuShown} />
				}
				
				
			</NavigationContainer>

			</SafeAreaView>
		</ThemeProvider>		
	);
}


const styles = StyleSheet.create({


	
});