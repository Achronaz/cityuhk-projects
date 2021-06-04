import sys
from copy import deepcopy

ACTIONS = {"U": [-1, 0], "D": [1, 0], "L": [0, -1], "R": [0, 1]}
GOAL = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

class Node:
    def __init__(self, current, parent, g, h, action):
        self.current = current          # current node
        self.parent = parent            # parent node
        self.g = g                      # number of step taken to current state
        self.h = h                      # estimated cost to goal by euclidean distance
        self.action = action            # action taken from parent to current state(U,D,L,R)
    def score(self):                    # score of the node (g+h) 
        return self.g + self.h

def getPosition(state, element):        # get position (r,c) of element in state
    for row in range(len(state)):
        if element in state[row]:
            return (row, state[row].index(element))

def getEuclideanCost(state):           # get euclidean cost to goal
    cost = 0
    for row in range(len(state)):
        for col in range(len(state)):
            pos = getPosition(GOAL, state[row][col])
            cost += abs(row - pos[0]) + abs(col - pos[1])
    return cost

def getBestNode(openSet):               # get best node from open set
    isFirstNode = True
    for node in openSet.values():
        if isFirstNode or node.score() < bestScore:
            isFirstNode = False
            bestNode = node
            bestScore = bestNode.score()
    return bestNode

def getAdjacencyNode(node):             # get adjacency node from node
    listNode = []
    emptyPos = getPosition(node.current, 0)
    for action in ACTIONS.keys():
        newPos = (emptyPos[0] + ACTIONS[action][0], emptyPos[1] + ACTIONS[action][1])
        if 0 <= newPos[0] < len(node.current) and 0 <= newPos[1] < len(node.current[0]):
            newState = deepcopy(node.current)
            newState[emptyPos[0]][emptyPos[1]] = node.current[newPos[0]][newPos[1]]
            newState[newPos[0]][newPos[1]] = 0
            listNode.append(Node(newState, node.current, node.g + 1, getEuclideanCost(newState), action))
    return listNode

def getPath(closedSet):                 # get path from closed set
    node = closedSet[str(GOAL)]
    path = list()
    while node.action:
        path.append({'action': node.action, 'board': node.current})
        node = closedSet[str(node.parent)]
    path.append({'action': '','board': node.current})
    path.reverse()
    return path

def solvePuzzle(puzzle):                # helper for solving the puzzle
    openSet = {str(puzzle): Node(puzzle, puzzle, 0, getEuclideanCost(puzzle), "")}
    closedSet = {}
    while True:
        testNode = getBestNode(openSet)
        closedSet[str(testNode.current)] = testNode
        if testNode.current == GOAL:
            return getPath(closedSet)   # return path to goal
        adjacencyNode = getAdjacencyNode(testNode)
        for node in adjacencyNode:
            if str(node.current) in closedSet.keys() or str(node.current) in openSet.keys() and openSet[str(node.current)].score() < node.score():
                continue
            openSet[str(node.current)] = node
        del openSet[str(testNode.current)]

if __name__ == '__main__':
    a = list(map(int, sys.argv[1]))
    puzzle = [ [a[0],a[1],a[2]], [a[3],a[4],a[5]], [a[6],a[7],a[8]] ]
    path = solvePuzzle(puzzle)
    locationLabel = [ ["A","B","C"], ["D","E","F"], ["G","H","I"] ]
    moveSequence = ""
    for node in path:
        for row in range(len(node['board'])):
            for col in range(len(node['board'])):
                if node['board'][row][col] == 0:
                    moveSequence += locationLabel[row][col]
    print(moveSequence[1:])             # first node has taken no action 