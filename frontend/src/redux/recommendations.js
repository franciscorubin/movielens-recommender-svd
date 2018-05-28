
const actionDescriptor = {
  setRecommendations: 'RECOMMENDATIONS/SET'
}

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