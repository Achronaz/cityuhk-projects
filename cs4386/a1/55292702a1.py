import sys
from itertools import combinations

n = int(sys.argv[1])
number_taken = [0,0,0,0,0,0,0,0,0]
move_taken = []

#winComb = [x for x in [n for n in combinations([0,1,2,3,4,5,6,7,8],3)] if sum(x) == 14]
winComb = [[0, 6, 8], [1, 5, 8], [1, 6, 7], [2, 4, 8], [2, 5, 7], [3, 4, 7], [3, 5, 6]]

# determine game is over
def isGameover(moves):
    if len(moves) >= 9:
        return True                                     # no available move
    for w in winComb:
        if set(w).issubset(moves[::2]) or set(w).issubset(moves[1::2]):
            return True                                 # has winner
    return False                                        # no winner, have available move

# evaluate score for player after move picking
def evaluate(moves):
    p1Holding = moves[::2]                              # player 1 holding (even in list)
    p2Holding = moves[1::2]                             # player 2 holding (odd in list)
    player = 1 if len(moves) % 2 == 0 else 2            # determine player who is last picking
    score = 0
    for w in winComb:
        if set(w).issubset(set(p1Holding)):             # winner holding must contain at least one of winComb
            score = 1000 * (6 - len(p1Holding))         # shorter length of holding get better score
            score = score if player == 1 else -score
        elif set(w).issubset(set(p2Holding)):
            score = 1000 * (6 - len(p2Holding))         
            score = score if player == 2 else -score
    return score

def getBestMove(moves,maxDepth):
    score, move = abNegamax(moves,maxDepth,0,-float('inf'),float('inf'))
    return move

def abNegamax(moves,maxDepth,currentDepth,alpha,beta):
    if isGameover(moves) or maxDepth == currentDepth:
        return evaluate(moves), None
    bestMove = None
    bestScore = -float('inf')
    availableMove = [n for n in [0,1,2,3,4,5,6,7,8] if n not in moves]
    for move in availableMove:
        newMove = moves.copy()
        newMove.append(move)
        recursedScore, currentMove = abNegamax(newMove, maxDepth,currentDepth+1,-beta,-max(alpha, bestScore))
        currentScore = -recursedScore
        if currentScore > bestScore:
            bestScore = currentScore
            bestMove = move
            if bestScore >= beta:
                return bestScore, bestMove
    return bestScore, bestMove

for i in range(n):
    move_taken.append(int(sys.argv[i+2]))
    number_taken[move_taken[i]] = 1

my_move = getBestMove(move_taken,10)
#print("bestMove:"+str(my_move))

if (my_move is not None and my_move >= 0):
   move_taken.append(my_move)
   n = n + 1

output = str(n)
for i in range(n):
    output = output+" "+str(move_taken[i])
print(output)

# ########################################################################## #
# If game is over(someone win or draw game), value of my_move would be None, #
# the output of the program would be same as input.                          #
# ########################################################################## #

# testcase:
# 4 0 1 6 3
# 4 0 1 8 3
#
#
