import json

TABLE_FILENAME = '../data/tables.txt'
OUTPUT_FILENAME = '../data/pipe_counts.txt'


def main():
   with open(TABLE_FILENAME) as f:
      masterTable = getMasterTable(f.read())
   with open(OUTPUT_FILENAME, 'w') as f:
      f.write(json.dumps(masterTable))
      print('Success: Pipeline data written to {}.'.format(OUTPUT_FILENAME))


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
