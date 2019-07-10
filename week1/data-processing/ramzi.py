import pandas as pd

data = pd.read_csv("../health-pricing/src/Data/ramzi.csv")
print(data.describe())

# data = data.ix[:200, :]

# groupedData = data.groupby(['CPT_CODE']).agg({'Charges': 'mean', 'Payments': 'mean'})\
#     .rename(columns={'Charges': 'charges_mean', 'Payments': 'payments_mean'})

# groupedData = data.groupby(['CPT_CODE', 'BILLING_PROV_NM']).agg({'Charges': 'mean', 'Payments': 'mean'})\
#     .rename(columns={'Charges': 'charges_mean', 'Payments': 'payments_mean'})
#
#
# numberOfProcedures = data.groupby(['CPT_CODE', 'BILLING_PROV_NM']).agg({'PROCQTY': 'sum'})\
#     .rename(columns={'PROCQTY': 'PROCQTY_sum'})


print(data.iloc[:,8].tolist())

print(data.iloc[:,8].sort_values().value_counts())

# print(data['I'].unique())


