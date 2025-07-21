#!/usr/bin/env python3
"""
Tennis String Database Scraper
Scrapes string data from Tennis Warehouse and outputs JSON for PocketBase import
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

def parse_string_name(string_text):
    """Parse brand and model from string name"""
    # Extract gauge info (in parentheses at the end)
    gauge_match = re.search(r'\(([^)]+)\)$', string_text.strip())
    gauge = gauge_match.group(1) if gauge_match else None
    
    # Remove gauge from string name
    name_without_gauge = re.sub(r'\s*\([^)]+\)$', '', string_text.strip())
    
    # Split into brand and model (first word is usually brand)
    parts = name_without_gauge.split(' ', 1)
    if len(parts) >= 2:
        brand = parts[0]
        model = parts[1]
    else:
        brand = None
        model = name_without_gauge
    
    return brand, model, gauge

def scrape_tennis_strings():
    """Scrape tennis strings data from Tennis Warehouse"""
    url = "https://twu.tennis-warehouse.com/learning_center/reporter2.php"
    
    print(f"Fetching data from {url}...")
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching page: {e}")
        return []
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the table with string data
    table = soup.find('table')
    if not table:
        print("Could not find table on page")
        return []
    
    rows = table.find_all('tr')
    if len(rows) < 2:
        print("No data rows found in table")
        return []
    
    # Get headers
    header_row = rows[0]
    headers = [th.get_text(strip=True) for th in header_row.find_all(['th', 'td'])]
    print(f"Found headers: {headers}")
    
    strings_data = []
    
    for row in rows[1:]:  # Skip header row
        cells = row.find_all(['td', 'th'])
        if len(cells) < 7:  # Ensure we have enough columns
            continue
        
        row_data = [cell.get_text(strip=True) for cell in cells]
        
        # Parse the string name
        string_name = row_data[0]
        brand, model, gauge = parse_string_name(string_name)
        
        # Extract other data
        ref_tension = row_data[1]
        swing_speed = row_data[2]
        material = row_data[3]
        stiffness = row_data[4]
        tension_loss = row_data[5]
        spin_potential = row_data[6]
        
        # Create string record
        string_record = {
            "brand": brand,
            "model": model,
            "material": material,
            "gauge": gauge,
            "color": None,  # Not available in this dataset
            "notes": f"Ref.Tension: {ref_tension}, Swing: {swing_speed}, Stiffness: {stiffness}lb/in, Loss: {tension_loss}, Spin: {spin_potential}",
            "scraped_from": "tennis-warehouse.com",
            "scraped_at": datetime.now().isoformat()
        }
        
        strings_data.append(string_record)
        
        print(f"Parsed: {brand} {model} ({gauge})")
    
    print(f"Successfully scraped {len(strings_data)} strings")
    return strings_data

def save_to_json(data, filename="tennis_strings.json"):
    """Save data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Data saved to {filename}")

def main():
    print("Tennis String Database Scraper")
    print("=" * 40)
    
    # Scrape the data
    strings_data = scrape_tennis_strings()
    
    if not strings_data:
        print("No data was scraped. Exiting.")
        return
    
    # Save to JSON
    output_file = f"tennis_strings_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    save_to_json(strings_data, output_file)
    
    # Print summary
    print("\nSummary:")
    print(f"Total strings: {len(strings_data)}")
    
    # Show unique brands
    brands = set(item['brand'] for item in strings_data if item['brand'])
    print(f"Unique brands: {len(brands)}")
    print(f"Brands: {', '.join(sorted(brands))}")
    
    # Show materials
    materials = set(item['material'] for item in strings_data if item['material'])
    print(f"Materials: {', '.join(sorted(materials))}")

if __name__ == "__main__":
    main()