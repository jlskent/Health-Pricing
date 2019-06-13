import pandas as pd

data = pd.read_csv("../health-pricing/src/Data/sample_data.csv")
print(data.describe())

data = data.ix[:200, :]

# groupedData = data.groupby(['CPT_CODE']).agg({'Charges': 'mean', 'Payments': 'mean'})\
#     .rename(columns={'Charges': 'charges_mean', 'Payments': 'payments_mean'})

groupedData = data.groupby(['CPT_CODE', 'BILLING_PROV_NM']).agg({'Charges': 'mean', 'Payments': 'mean'})\
    .rename(columns={'Charges': 'charges_mean', 'Payments': 'payments_mean'})


numberOfProcedures = data.groupby(['CPT_CODE', 'BILLING_PROV_NM']).agg({'PROCQTY': 'sum'})\
    .rename(columns={'PROCQTY': 'PROCQTY_sum'})


print(groupedData)
print(numberOfProcedures)

print(numberOfProcedures.to_json(orient='columns'))
# print(numberOfProcedures)
numberOfProcedures.to_csv("../health-pricing/src/Data/grouped_data.csv")

# for k, v in numberOfProcedures.keys():
#     print(k)
#     print(groupedData.get_group())



numberOfProcedures.boxplot(column=['CPT_CODE', 'BILLING_PROV_NM'])



boxplot = numberOfProcedures.boxplot(by='BILLING_PROV_NM')
import matplotlib.pyplot as plt
import numpy as np

# Random test data
np.random.seed(19680801)
# all_data = numberOfProcedures
all_data = [np.random.normal(0, std, size=100) for std in range(1, 4)]
print (all_data)
labels = ['x1', 'x2', 'x3']

fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(9, 4))

# rectangular box plot
bplot1 = axes[0].boxplot(all_data,
                         vert=True,  # vertical box alignment
                         patch_artist=True,  # fill with color
                         labels=labels)  # will be used to label x-ticks
axes[0].set_title('Rectangular box plot')

# notch shape box plot
bplot2 = axes[1].boxplot(all_data,
                         notch=True,  # notch shape
                         vert=True,  # vertical box alignment
                         patch_artist=True,  # fill with color
                         labels=labels)  # will be used to label x-ticks
axes[1].set_title('Notched box plot')

# fill with colors
colors = ['pink', 'lightblue', 'lightgreen']
for bplot in (bplot1, bplot2):
    for patch, color in zip(bplot['boxes'], colors):
        patch.set_facecolor(color)

# adding horizontal grid lines
for ax in axes:
    ax.yaxis.grid(True)
    ax.set_xlabel('Three separate samples')
    ax.set_ylabel('Observed values')

plt.show()


# Create a sample data frame


"""""
df = pd.DataFrame({'A': [1, 1, 1, 2, 2],
                   'B': range(5),
                   'C': range(5)})

# ==== SINGLE COLUMN (SERIES) ====
# Syntax soon to be deprecated
df.groupby('A').B.agg({'foo': 'count'})
# Recommended replacement syntax
df.groupby('A').B.agg(['count']).rename(columns={'count': 'foo'})

# ==== MULTI COLUMN ====
# Syntax soon to be deprecated
df.groupby('A').agg({'B': {'foo': 'sum'}, 'C': {'bar': 'min'}})
# Recommended replacement syntax
df.groupby('A').agg({'B': 'sum', 'C': 'min'}).rename(columns={'B': 'foo', 'C': 'bar'})
# As the recommended syntax is more verbose, parentheses can
# be used to introduce line breaks and increase readability
(df.groupby('A')
    .agg({'B': 'sum', 'C': 'min'})
    .rename(columns={'B': 'foo', 'C': 'bar'})
)
"""""
# import np from numpy
# 
# def fetch_price(symbol, producer, topic_name):
#     """
#     retrieve data and sent to kafka
#     """
#     logger.debug('function fetch_price for %s', symbol)
#     try:
#         response = requests.get('%s/products/%s/ticker'% (API_BASE, symbol))
#         price = response.json()['price']
#         timestamp = time.time()
#         # create a json
#         payload = {
#             'Symbol': str(symbol),
#             'LastTradePrice': str(price),
#             'Timestamp': str(timestamp)
#         }
#         # serialization of json(convert json to str end encode)
#         producer.send(topic=topic_name, value=json.dumps(payload).encode('utf-8'))
#         logger.debug('Retrieved %s info %s', symbol, payload)
#         logger.debug('Sent price for %s to Kafka' % symbol)
#     except KafkaTimeoutError as timeout_error:
#         logger.warn('Failed to send price to kafka, caused by: %s', (timeout_error.message))
#     except Exception as e:
#         logger.warn('Failed to fetch price: %s', (e))
# 
# 
# 
# 
#         
# if __name__ == '__main__':
#     # Setup command line arguments
#     parser = argparse.ArgumentParser()
#     parser.add_argument('symbol', help='the symbol you want to pull')
#     parser.add_argument('topic_name', help='the kafka topic push to')
#     parser.add_argument('kafka_broker', help='the location of the kafka broker')
# 
#     args = parser.parse_args()
#     symbol = args.symbol
#     topic_name = args.topic_name
#     kafka_broker = args.kafka_broker
# 
#     # Check if the symbol is supported.
#     check_symbol(symbol)
# 
#     # init a simple kafka producer
#     # see KafkaProducer source code in github
#     producer = KafkaProducer(bootstrap_servers=kafka_broker)
# 
#     # Schedule and run the fetch_price function every second
#     # function name + parameters
#     schedule.every(1).second.do(fetch_price, symbol, producer, topic_name)
# 
#     # Setup shutdown hook:release producer function
#     atexit.register(shutdown_hook, producer)
# 
#     while True:
#         schedule.run_pending()
#         time.sleep(1)
