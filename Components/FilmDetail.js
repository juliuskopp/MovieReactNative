// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Image, TouchableOpacity, Share} from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import { ScrollView } from 'react-native-gesture-handler'

import moment from 'moment'
import numeral from 'numeral'

import {connect} from 'react-redux'

class FilmDetail extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
          return {
              // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
              headerRight: <TouchableOpacity
                              style={styles.share_touchable_headerrightbutton}
                              onPress={() => params.shareFilm()}>
                              <Image
                                style={styles.share_image}
                                source={require('../Images/ic_share.png')} />
                            </TouchableOpacity>
          }
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            film: undefined,    // pour l'instant on a pas les infos donc on initialise le film à undefined
            isLoading: true     // à l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail
        }
        // Ne pas oublier de binder la fonction _shareFilm sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.film sera undefined et fera planter l'application
        this._shareFilm = this._shareFilm.bind(this)
    }

    // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
    _updateNavigationParams() {
        this.props.navigation.setParams({
        shareFilm: this._shareFilm,
        film: this.state.film
        })
    }

        // **********************
        //   2 façons de récupérer les paramètres de navigation
        //  --> this.props.navigation.state.params.idFilm
        //  --> this.props.navigation.getParam('idFilm')        --> dispo depuis la version 2 de React Navigation

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
          // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
          this.setState({
            film: this.props.favoritesFilm[favoriteFilmIndex]
          }, () => { this._updateNavigationParams() })
          return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
          this.setState({
            film: data,
            isLoading: false
          }, () => { this._updateNavigationParams() })
        })
    }
        
    _displayLoading() {
        if (this.state.isLoading) {
            // si isLoading = true on affiche le chargement à l'écran
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _toggleFavorite() {
        const action = {
            type: "TOGGLE_FAVORITE",
            value: this.state.film
        }
        this.props.dispatch(action)
    }

    _displayFavoriteImage() {
        var sourceImage = require('../Images/ic_favorite_border.png')
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !==-1) {
            // film dans les favoris
            sourceImage = require('../Images/ic_favorite.png')
        }
        return(
            <Image 
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
    }

    _displayFilm() {
        const {film} = this.state
        if (film != undefined) {
            return (
                <ScrollView style={styles.scroolview_container}>
                    <Image
                        style={styles.image}
                        source={{uri: getImageFromApi(film.backdrop_path)}}                      
                    />
                    <Text style={styles.title_text} >{film.title}</Text>
                    <TouchableOpacity 
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite() } 
                    >
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.description_text} >{film.overview}</Text>
                    <Text style={styles.default_text}>
                        Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}
                    </Text>
                    <Text style={styles.default_text}>
                        Note : {film.vote_average} / 10
                    </Text>
                    <Text style={styles.default_text}>
                        Nombre de votes : {film.vote_count}
                    </Text>
                    <Text style={styles.default_text}>
                        Budget : {numeral(film.budget).format('0,0[.]00 $')}
                    </Text>
                    <Text style={styles.default_text}>
                        Genre(s) : {film.genres.map(function(genre){return genre.name;}).join(" / ")}
                    </Text>
                    <Text style={styles.default_text}>
                        Companie(s) : {film.production_companies.map(function(company){return company.name;}).join(" / ")}
                    </Text>                    
                </ScrollView>
            )
        }
    }

    _shareFilm() {
        const { film } = this.state
        Share.share({ title: film.title, message: film.overview })
    }

    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
          return (
            <TouchableOpacity
              style={styles.share_touchable_floatingactionbutton}
              onPress={() => this._shareFilm()}>
              <Image
                style={styles.share_image}
                source={require('../Images/ic_share.png')} />
            </TouchableOpacity>
          )
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()} 
                {this._displayFilm()}
                {this._displayFloatingActionButton()}               
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        main_container: {
            flex: 1
        },
        loading_container: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
        scroolview_container: {
            flex: 1
        },
        image: {
          height: 169,
          margin: 5
        },
        title_text: {
          fontWeight: 'bold',
          fontSize: 35,
          flex: 1,
          flexWrap: 'wrap',
          marginLeft: 5,
          marginRight: 5,
          marginTop: 10,
          marginBottom: 10,
          color: '#000000',
          textAlign: 'center'
        },
        description_text: {
          fontStyle: 'italic',
          color: '#666666',
          margin: 5,
          marginBottom: 15
        },
        default_text: {
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
        },
        favorite_container: {
            alignItems: 'center'    // Alignement des components enfants sur l'axe secondaire, X ici
        },
        favorite_image: {
            width: 40,
            height: 40
        },
        share_touchable_floatingactionbutton: {
            position: 'absolute',
            width: 60,
            height: 60,
            right: 30,
            bottom: 30,
            borderRadius: 30,
            backgroundColor: '#e91e63',
            justifyContent: 'center',
            alignItems: 'center'
        },
        share_image: {
            width: 30,
            height: 30
        },
        share_touchable_headerrightbutton: {
            marginRight: 8
        }        
    }
)




const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm }
}

export default connect(mapStateToProps)(FilmDetail)