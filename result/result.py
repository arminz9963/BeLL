
def main():

    tests = ["tests/neu/test_result_v6.txt"]

    for test in tests:
        scores = []
        with open(test, "r", encoding="utf-8") as datei:
            # 5 da es 5 Tests sind pro model
            for _ in range(5):
                _ = datei.readline()
                asg = datei.readline().strip().replace("Ausgabe:", "")
                asg = eval(asg)
                lsg = datei.readline().strip().replace("Lösung:", "")
                lsg = eval(lsg)
                score = get_score(asg, lsg)
                scores.append(score)
        sum = 0
        for score in scores:
            sum += score
        end_score = round(sum / len(scores), 2)
        with open("result/results.txt", "a", encoding="utf-8") as datei:
            datei.write(f"{test}:\n")
            datei.write(f"Scores: {scores}\n")
            datei.write(f"End Score: {end_score}\n\n")


def get_score(asg, lsg):

    result_list = []

    if len(lsg) == len(asg):
        for i, cut in enumerate(lsg):
            start_lsg = cut[0]
            end_lsg = cut[1]
            start_asg = asg[i][0]
            end_asg = asg[i][1]

            #print(start_lsg, end_lsg, start_asg, end_asg)
            # case 1 asg = lsg
            if (start_lsg == start_asg) and (end_lsg == end_asg):
                result_list.append(1)

            # case 2 asg teilmenge von lsg
            elif (start_asg >= start_lsg) and (end_asg <= end_lsg):
                score = (end_asg - start_asg)/(end_lsg - start_lsg)
                result_list.append(score)

            # case 3 lsg teilmenge von asg
            elif (start_asg <= start_lsg) and (end_asg >= end_lsg):
                score = (end_lsg - start_lsg)/(end_asg - start_asg)
                result_list.append(score)

            # case 4 asg schneidet nur an lsg (asg früher als lsg)
            elif (start_asg < start_lsg) and (end_asg < end_lsg) and ((end_asg - start_lsg) > 0):
                overlap = end_asg - start_lsg
                score = overlap / (end_lsg - start_asg)
                result_list.append(score)

            # case 4.2 asg schneidet nur an lsg (lsg früher als asg)
            elif (start_asg > start_lsg) and (end_asg > end_lsg) and ((end_lsg - start_asg) > 0):
                overlap = end_lsg - start_asg
                score = overlap / (end_asg - start_lsg)
                result_list.append(score)

            # case 5 asg und lsg kein schnitt
            else:
                result_list.append(0)

    else:
        # vorübergehend
        result_list.append(0)


    sum = 0
    for result in result_list:
        sum += result

    # arithmetisches Mittel
    end_score = 100*sum / len(result_list)

    return round(end_score, 3)


if __name__ == "__main__":
    main()