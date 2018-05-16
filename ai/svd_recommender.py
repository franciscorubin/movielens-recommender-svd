import sys
import os
import dependencies
sys.path.append(dependencies.pytorch_utils)

import pandas as pd
import numpy as np
import math
from helpers.Metrics import Metrics
import pickle
import json

# TODO find out how to do prediction on new users / modified user tables
# TODO use pickle to save model after training

class SVD(object):
    def __init__(self, f, lr=0.03, small=True, min_improvement=0.001):
        self.lr = lr
        self.min_improvement = min_improvement
        # number of features to extract
        self.f = f
        self.load_dataset(small)
        # TODO set a better init_value
        self.init_model(0.1)
        self.epoch = 0
        logs_filename = 'f:{}_lr:{}_small:{}.json'.format(f, lr, small)
        self.metrics = Metrics(os.path.join(os.path.dirname(__file__), 'logs/{}'.format(logs_filename)))

    def load_dataset(self, small=True):
        if small:
            self.ratings = pd.read_csv(os.path.join(os.path.dirname(__file__), 'data/movielens_small/ratings.csv'), sep=",")
        else:
            self.ratings = pd.read_csv(os.path.join(os.path.dirname(__file__), 'data/movielens_full/ratings.csv'), sep=",")

        self.n_users = np.max(self.ratings.iloc[:, 0])
        self.n_items = np.max(self.ratings.iloc[:, 1])

    def init_model(self, init_value):
        if self.ratings is None:
            raise Exception('You must load the dataset first.')
        self.U = np.full((self.n_users, self.f), init_value)
        self.V = np.full((self.n_items, self.f), init_value)
        
    # Predict rating for user u and movie v
    def predict(self, u, v):
        rating = np.dot(self.U[u], self.V[v])
        if rating > 5:
            rating = 5
        elif rating < 1:
            rating = 1
        return rating

    # Execute one step of gradient descent on feature f, rows u and v
    def optimize(self, loss, f, u, v):
        V_f = self.V[v][f]
        U_f = self.U[u][f]

        self.U[u][f] += self.lr * loss * V_f
        self.V[v][f] += self.lr * loss * U_f

    def train_pass_feature(self, feature):
        squared_error_total = 0.0
        total_iterations = 0
  
        for i, rating in self.ratings.iterrows():
            u_ind = int(rating['userId'] - 1)
            v_ind = int(rating['movieId'] - 1)
            rating = rating['rating']

            prediction = self.predict(u_ind, v_ind)
            loss = rating - prediction

            self.optimize(loss, feature, u_ind, v_ind)

            squared_error_total += loss**2
            total_iterations += 1

        mse = squared_error_total / total_iterations
        rmse = math.sqrt(mse)
        return rmse

    def train_feature(self, feature):
        continue_training = True
        prev_rmse = 9999999999.0
        while continue_training:
            rmse = self.train_pass_feature(feature)
            print('Feature: {}, Epoch: {}, Train RMSE: {}'.format(feature, self.epoch, rmse))
            self.metrics.track({'feature': feature, 'rmse': rmse, 'epoch': self.epoch })

            if (prev_rmse - rmse) < self.min_improvement:
                continue_training = False
            prev_rmse = rmse
            self.epoch += 1

    def train(self):
        for feature in range(0, self.f):
            self.train_feature(feature)
        self.metrics.save()


def store_as_json(name, U, V):
    U_json = U.data.tolist()
    V_json = V.data.tolist()

    obj = {
        'U': U_json,
        'V': V_json
    }
    with open(os.path.join(os.path.dirname(__file__), 'checkpoint/{}.json'.format(name)), 'w') as f:
        json.dump(obj, f)

if __name__ == '__main__':
    svd = SVD(40, small=False)
    print('Starting')
    svd.train()
    
    store_as_json('svd_full_2', svd.U, svd.V)

# ROW BY ROW GRADIENT DESCENT
# Results:
# Train: RMSE: 1.3128799954010697
# Train: RMSE: 1.013667205891287
# Train: RMSE: 0.9419716161325883
# Train: RMSE: 0.9224674553194276
# Train: RMSE: 0.9132454680758879
# Train: RMSE: 0.9073168200099548
# Train: RMSE: 0.9029468668549482
# Train: RMSE: 0.8994949562429652
# Train: RMSE: 0.8966632079719318
# Train: RMSE: 0.8942877591970867
# Train: RMSE: 0.8922658179297918
# Train: RMSE: 0.8905307660402288
# Train: RMSE: 0.8890356140637652
# Train: RMSE: 0.8877443933786896
# Train: RMSE: 0.8866289670991004
# Train: RMSE: 0.8856691593049612
# Train: RMSE: 0.8848455664622883
# Train: RMSE: 0.8841417395715939
# Train: RMSE: 0.8835479782411698
# Train: RMSE: 0.8830552754444121
# Train: RMSE: 0.8826552066934262
# Train: RMSE: 0.8823415735524409
# Train: RMSE: 0.8821088230727999
# Train: RMSE: 0.8819520496628589
# Train: RMSE: 0.8818666355097835
# Train: RMSE: 0.8818481824900517
# Train: RMSE: 0.881893809512424
# Train: RMSE: 0.8820018156067969
# Train: RMSE: 0.8821705286282108
# Train: RMSE: 0.8823973963033516
# Train: RMSE: 0.8826828108972604
# Train: RMSE: 0.8830257246351858
# Train: RMSE: 0.8834259629698005
# Train: RMSE: 0.8838826464042172
# Train: RMSE: 0.8843951739019013
# Train: RMSE: 0.8849635839258089
# Train: RMSE: 0.8855893311825416
# Train: RMSE: 0.8862741161888721
# Train: RMSE: 0.8870181333426251
# Train: RMSE: 0.8878212488436839
# Train: RMSE: 0.8886873077445507
# Train: RMSE: 0.8896177218023228
# Train: RMSE: 0.8906157275022067
# Train: RMSE: 0.8916834385643506
# Train: RMSE: 0.8928243183772139
# Train: RMSE: 0.8940420794951964
# Train: RMSE: 0.8953383372732765
# Train: RMSE: 0.8967191032224973
# Train: RMSE: 0.8981905966081062
# Train: RMSE: 0.8997589269929408
# Train: RMSE: 0.9014295697403164
# Train: RMSE: 0.9032094496354878
# Train: RMSE: 0.9051049445955853
# Train: RMSE: 0.9071244893725788
# Train: RMSE: 0.9092807759822786
# Train: RMSE: 0.9115865723764152
# Train: RMSE: 0.9140600083887146
# Train: RMSE: 0.9167157871280075
# Train: RMSE: 0.9195712216746047
# Train: RMSE: 0.9226447489136661
# Train: RMSE: 0.9259643443316412
# Train: RMSE: 0.9295610587821613
# Train: RMSE: 0.9334738438300201
# Train: RMSE: 0.9377413894537229
# Train: RMSE: 0.9424052440838885
# Train: RMSE: 0.9475516042981524
# Train: RMSE: 0.9532630262050223
# Train: RMSE: 0.9596226547752241
# Train: RMSE: 0.966756615117188
# Train: RMSE: 0.9748571349201685
# Train: RMSE: 0.9841388366772184
# Train: RMSE: 0.99494272228908
# Train: RMSE: 1.0077476030569688
# Train: RMSE: 1.0231245735880845
# Train: RMSE: 1.0418380359434798
# import os
# import pandas as pd
# import numpy as np
# import math

# class SVD(object):
#     def __init__(self, f, lr=0.04, small=True):
#         self.lr = lr
#         # number of features to extract
#         self.f = f
#         self.load_dataset(small)
#         # TODO set a better init_value
#         self.init_model(0.1)

#     def load_dataset(self, small=True):
#         if small:
#             self.ratings = pd.read_csv(os.path.join(os.path.dirname(__file__), 'data/movielens_small/ratings.csv'), sep=",")
#         else:
#             self.ratings = pd.read_csv(os.path.join(os.path.dirname(__file__), 'data/movielens_full/ratings.csv'), sep=",")

#         self.n_users = np.max(self.ratings.iloc[:, 0])
#         self.n_items = np.max(self.ratings.iloc[:, 1])

#     def init_model(self, init_value):
#         if self.ratings is None:
#             raise Exception('You must load the dataset first.')
#         self.U = np.full((self.n_users, self.f), init_value)
#         self.V = np.full((self.n_items, self.f), init_value)
        
#     # Predict rating for user u and movie v
#     def predict(self, u, v):
#         rating = np.dot(self.U[u], self.V[v])
#         if rating > 5:
#             rating = 5
#         elif rating < 1:
#             rating = 1
#         return rating

#     # Execute one step of gradient descent on rows u and v
#     def optimize(self, loss, u, v):
#         V_row = self.V[v]
#         U_row = self.U[u]

#         self.U[u] += self.lr * loss * V_row
#         self.V[v] += self.lr * loss * U_row

#     def train(self, epoch):
#         squared_error_total = 0.0
#         for i, rating in self.ratings.iterrows():
#             u_ind = int(rating['userId'] - 1)
#             v_ind = int(rating['movieId'] - 1)
#             rating = rating['rating']

#             prediction = self.predict(u_ind, v_ind)
#             loss = rating - prediction

#             self.optimize(loss, u_ind, v_ind)

#             squared_error_total += loss**2

#         total_iterations = i + 1
#         mse = squared_error_total / total_iterations
#         rmse = math.sqrt(mse)
#         return rmse


# if __name__ == '__main__':
#     svd = SVD(15)

#     for epoch in range(0, 100000):
#         rmse = svd.train(epoch)
#         print('Train: RMSE: {}'.format(rmse))




