import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, SafeAreaView, Button, Alert, StatusBar, Dimensions, useColorScheme} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef, navigate } from './app/RootNavigation'
import { ThemeProvider } from './app/Components/ThemeContext';
import Header from './app/Components/Header';
import Login from './app/Components/Login';	
import Home from './app/Components/Home';													
import Matches from './app/Components/Matches';
import Account from './app/Components/Account';
import Navbar from './app/Components/Navbar';

import { setData, getData, removeData } from './app/Components/Storage';
import colors from './app/config/colors';


const Stack = createNativeStackNavigator();


export default function App() {

	const systemTheme = useColorScheme();
	const [theme, setTheme] = useState(systemTheme);
	const mainColor = theme === 'light' ? colors.light : colors.dark
	const secondaryColor = theme === 'light' ? colors.dark : colors.light

	const [page, setPage] = useState();
	const [matchesList, setMatchesList] = useState([]);


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
			<SafeAreaView style={{flex: 1, backgroundColor: mainColor}}>

			<StatusBar />

			<NavigationContainer ref={navigationRef} style={{flex: 1, backgroundColor: mainColor}}>
				
				{page != 'Login' &&
					<Header />
				}

				<Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false, contentStyle: {flex: 1, backgroundColor: mainColor}, animation: "none"}}>
					<Stack.Screen name="Login">{props => <Login {...props} setPage={setPage} />}</Stack.Screen>
					<Stack.Screen name="Home">{props => <Home {...props} setPage={setPage} matchesList={matchesList} addMatchData={addMatchData} />}</Stack.Screen>
					<Stack.Screen name="Matches">{props => <Matches {...props} matchesList={matchesList} />}</Stack.Screen>
					<Stack.Screen name="Account">{props => <Account {...props} page={page} />}</Stack.Screen>
				</Stack.Navigator>

				{page != 'Login' &&
					<Navbar page={page} setPage={setPage} />
				}
				
				
			</NavigationContainer>

			</SafeAreaView>
		</ThemeProvider>		
	);
}


const styles = StyleSheet.create({


	
});