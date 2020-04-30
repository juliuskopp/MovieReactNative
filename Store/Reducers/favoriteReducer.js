// Store/Reducers/favoriteReducer.js

const initialState = { favoritesFilm: [] }

function toggleFavorite(state = initialState, action) {
    let nextState

    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const favoriteFilmIndex = state.favoritesFilm.findIndex( item => item.id === action.value.id)
            if (favoriteFilmIndex !== -1) {                
                // le film est déjà dans la liste des favoris, on le supprime
                nextState = {
                    ...state,
                    favoritesFilm: state.favoritesFilm.filter( (item, index) => index !== favoriteFilmIndex )
                }
                console.log("supprime le film - reste : " + nextState.favoritesFilm.length)
            } else {
                // le film n'est pas dans les films favoris, on l'ajoute à la liste
                nextState = {
                    ...state,
                    favoritesFilm: [ ...state.favoritesFilm, action.value ]
                }
                console.log("ajoute le film - reste : " + nextState.favoritesFilm.length)
            }
            return nextState || state
        default:
            return state
    }
}

export default toggleFavorite
