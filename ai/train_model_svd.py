import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error
from math import sqrt
import matplotlib.pyplot as plt
import scipy
import pickle
import json

from scipy import sparse
from scipy.sparse import linalg

checkpoint_name = 'svd_full_2'

checkpoint_file = os.path.join(os.path.dirname(__file__), 'checkpoint/{}.pickle'.format(checkpoint_name))


def store_as_json(U, S, Vt):
    U_json = U.data.tolist()
    S_json = S.data.tolist() 
    Vt_json = Vt.data.tolist()

    obj = {
        'U': U_json,
        'S': S_json,
        'Vt': Vt_json
    }
    with open(os.path.join(os.path.dirname(__file__), 'checkpoint/{}.json'.format(checkpoint_name)), 'w') as f:
        json.dump(obj, f)

def calculate_loss(y, y_pred):
    # use only known values
    y_pred_known = y_pred[y.nonzero()].flatten()
    y_known = y[y.nonzero()].flatten()
    return sqrt(mean_squared_error(y_pred_known, y_known))


def store_dataset_info(ratings_matrix):
    #Get info
    total_ratings_movies = ratings_matrix.sum(axis=0)
    total_ratings_movies = total_ratings_movies.tolist()[0]
    total_ratings_movies_indexed = [(i,movie) for i, movie in enumerate(total_ratings_movies) ]
    total_ratings_movies_indexed.sort(key=lambda x: x[1], reverse=True)

    count_ratings_movies = ratings_matrix.astype(bool).sum(axis=0)
    count_ratings_movies = count_ratings_movies.tolist()[0]
    count_ratings_movies_indexed = [(i,movie) for i, movie in enumerate(count_ratings_movies) ]
    count_ratings_movies_indexed.sort(key=lambda x: x[1], reverse=True)

    info = {}
    info['total_rating'] = total_ratings_movies_indexed
    info['count_ratings'] = count_ratings_movies_indexed

    with open(os.path.join(os.path.dirname(__file__), 'checkpoint/dataset_info_full.json'.format(checkpoint_name)), 'w') as f:
        json.dump(info, f)


    # save small info file only for movies with at least 1000 ratings
    count_ratings_movies = np.array(count_ratings_movies)
    total_ratings_movies = np.array(total_ratings_movies)

    subset_filter = count_ratings_movies > 1000
    count_ratings_movies_small = count_ratings_movies[subset_filter].tolist()
    total_ratings_movies_small = total_ratings_movies[subset_filter].tolist()

    count_ratings_movies_indexed_small = [(i,movie) for i, movie in enumerate(count_ratings_movies_small) ]
    count_ratings_movies_indexed_small.sort(key=lambda x: x[1], reverse=True)


    total_ratings_movies_indexed_small = [(i,movie) for i, movie in enumerate(total_ratings_movies_small) ]
    total_ratings_movies_indexed_small.sort(key=lambda x: x[1], reverse=True)

    info_small = {}
    info_small['total_rating'] = total_ratings_movies_indexed_small
    info_small['count_ratings'] = count_ratings_movies_indexed_small

    with open(os.path.join(os.path.dirname(__file__), 'checkpoint/dataset_info_small.json'.format(checkpoint_name)), 'w') as f:
        json.dump(info_small, f)


def load_ratings_matrix():
    # Load and fill data
    ratings = pd.read_csv(os.path.join(os.path.dirname(
        __file__), 'data/movielens_full/ratings.csv'), sep=",")

    n_users = np.max(ratings.iloc[:, 0])
    n_items = np.max(ratings.iloc[:, 1])
    print('Nr of Users: {}'.format(n_users))
    print('Nr of Movies: {}'.format(n_items))

    ratings_matrix = sparse.lil_matrix((n_users, n_items))

    for ind, rating in ratings.iterrows():
        user = rating['userId'] - 1
        item = rating['movieId'] - 1
        rating = rating['rating']

        ratings_matrix[user, item] = rating
    return ratings_matrix


def train_svd(ratings_matrix, n_features=9):
    print('Number of features: {}'.format(n_features))
    U, s, Vt = linalg.svds(ratings_matrix, k=n_features)
    S = np.diag(s)
    return U, S, Vt

ratings_matrix = load_ratings_matrix()
store_dataset_info(ratings_matrix)

sparsity = round(1.0 - (ratings_matrix.getnnz() /
                        (ratings_matrix.shape[0] * ratings_matrix.shape[1])), 3)
print('Data Sparsity: {}%'.format(sparsity * 100))

(U, S, Vt) = train_svd(ratings_matrix)

model = {}
model['U'] = U
model['S'] = S
model['Vt'] = Vt

prediction_matrix = np.dot(np.dot(U, S), Vt)
train_loss = calculate_loss(
    np.array(ratings_matrix.todense()), prediction_matrix)
print('Train Loss: {}'.format(train_loss))

with open(checkpoint_file, 'wb') as f:
    pickle.dump(model, f)

store_as_json(U, S, Vt)