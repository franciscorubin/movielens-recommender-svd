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

checkpoint_name = 'svd_full_filtered'

checkpoint_file = os.path.join(os.path.dirname(__file__), 'checkpoint/{}.pickle'.format(checkpoint_name))

with open(checkpoint_file, 'rb') as f:
  model = pickle.load(f)
  U = model['U']
  S = model['S']
  Vt = model['Vt']

def predict_new_user(x_new):
    u_new = np.dot(np.dot(x_new, np.transpose(Vt)), np.linalg.inv(S))
    y_new = np.dot(np.dot(u_new, S), Vt)
    return y_new, u_new


def predict_existing():
    prediction_matrix = np.dot(np.dot(U, S), Vt)
    return prediction_matrix
