from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import joblib
import os


app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Load the model (adjust path if needed)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = joblib.load(MODEL_PATH)

# model = joblib.load('backend/model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data
        data = request.get_json()
        df = pd.DataFrame(data)
        
        # Required columns (same as training)
        required_columns = ['Age', 'Gender', 'Dependent_count', 'Education', 'Marital_Status', 'Income', 
                           'Card_Category', 'Months_on_book', 'Total_Relationship_Count', 'Months_Inactive',
                           'Contacts_Count', 'Credit_Limit', 'Total_Revolving_Bal', 'Total_Amt_Chng_Q4_Q1', 
                           'Total_Trans_Amt', 'Total_Trans_Ct', 'Total_Ct_Chng_Q4_Q1', 'Avg_Utilization_Ratio']
        
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'Missing required columns'}), 400
        
        # Directly predict (pipeline handles preprocessing)
        predictions = model.predict(df)
        predictions = ['Churn' if pred == 1 else 'Not Churn' for pred in predictions]
        
        # Add predictions
        df['Prediction'] = predictions
        
        # Save output CSV
        output_path = 'output_predictions.csv'
        df.to_csv(output_path, index=False)
        
        # Response
        response = {
            'predictions': df.to_dict(orient='records'),
            'csv_path': output_path
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['GET'])
def download():
    try:
        return send_file('output_predictions.csv', as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
