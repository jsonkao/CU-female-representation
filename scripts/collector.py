TABLE_FILENAME = '../data/tables.txt'

def pretty(d, indent=0):
   for key, value in d.items():
      print('\t' * indent + str(key))
      if isinstance(value, dict):
         pretty(value, indent+1)
      else:
         print('\t' * (indent+1) + str(value))


def main():
    with open(TABLE_FILENAME) as f:
        masterTable = getMasterTable(f.read())
        pretty(masterTable)

def getMasterTable(text):
    areas = text.split(';');
    master = {}
    for a in areas:
        a = a.strip()
        a = list(filter(None, a.split('\n')))
        filename = a[0]
        master[filename] = getAreaTables(a[1:])
    return master

def getAreaTables(lines):
    tables = {}
    for i in range(0, len(lines), 4):
        # Tables in each academic area are split into academic levels.
        level = lines[i]
        years = [int(x) for x in lines[i+1].split(' ')]
        femaleCounts = [int(x) for x in lines[i+2].split(' ')[1:]]
        maleCounts = [int(x) for x in lines[i+3].split(' ')[1:]]
        tables[level] = [femaleCounts, maleCounts]
    return tables

if __name__ == '__main__':
    main()
