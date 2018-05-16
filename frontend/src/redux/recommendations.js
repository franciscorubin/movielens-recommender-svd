
const actionDescriptor = {
  setRecommendations: 'RECOMMENDATIONS/SET'
}

// TODO hay un fallo. cuando llegan recomendaciones se meten en la lista movieInfo, la cual es usada para la pantalla Rate. esto hara que muchas peliculas de Rate sean de las recomendadas

export const setRecommendations = (recommendations) => {
  return {
    type: actionDescriptor.setRecommendations,
    data: recommendations
  }
}

const initialState = {
  recommendations: []
}

export function recommendations(state = initialState, action) {
  switch (action.type) {
    case actionDescriptor.setRecommendations:
      return { ...state, recommendations: action.data }
    default:
      return state
  }
}