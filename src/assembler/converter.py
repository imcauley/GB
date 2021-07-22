import json

with open('instructions.json') as f:
    instructions = json.load(f)

assemler_dict = {}
for (code, instruction) in instructions['unprefixed'].items():
    instruction_mnemonic = instruction['mnemonic']
    operands = ', '.join([x['name'] for x in instruction['operands']])
    
    if(operands):
        instruction_mnemonic += ' ' + operands

    assemler_dict[instruction_mnemonic] = code

print(assemler_dict)