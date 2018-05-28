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

checkpoint_name = 'svd_full'

checkpoint_file = os.path.join(os.path.dirname(
    __file__), 'checkpoint/{}.json'.format(checkpoint_name))

with open(checkpoint_file, 'r') as f:
    model = json.load(f)
    U = np.array(model['U'])
    V = np.array(model['V'])

f = U.shape[1]

ratings = pd.read_csv(os.path.join(os.path.dirname(
    __file__), 'data/movielens_full/ratings.csv'), sep=",")


def calculate_loss(real, pred):
    # use only known values
    y_pred_known = y_pred[y.nonzero()].flatten()
    y_known = y[y.nonzero()].flatten()
    return sqrt(mean_squared_error(y_pred_known, y_known))


def testPrediction(userId):
    x = ratings[ratings['userId'] == userId]

    u_real = U[userId - 1]

    u_pred = fit_u(x)
    print(u_pred)
    u_loss = mean_squared_error(u_pred, u_real)

    # this is how we predict
    x_pred = np.dot(u_pred, np.transpose(V)).clip(1.0, 5.0)
#    x_loss = mean_squared_error(x_pred, x)

    print('U Loss: {} MSE'.format(u_loss))


def predict(u, v):
    return np.dot(u, v).clip(1.0, 5.0)

def fit_u(x, lr=0.03, min_improvement=0.001, init_value=0.1):
    # optim: unew * V = xnew - only change unew
    unew = np.array([init_value] * f)

    for k in range(0, f):
        prev_tot_loss = 99999999
        tot_loss = 99999    
        while (prev_tot_loss - tot_loss) >= min_improvement:
            prev_tot_loss = tot_loss
            comp = 0
            tot_loss = 0
            for i, ratingItem in x.iterrows():    
                v_ind = int(ratingItem['movieId'] - 1)
                rating = ratingItem['rating']

                pred = predict(unew, V[v_ind])
                loss = rating - pred

                unew[k] += lr * loss * V[v_ind][k]

                tot_loss += loss**2
                comp += 1
            print('Feature {}, Loss: {}'.format(k, sqrt(tot_loss/comp)))
    return unew

if __name__ == '__main__':
    testPrediction(2)