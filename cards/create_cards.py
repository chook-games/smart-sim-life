#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create cards directory
os.makedirs('cards', exist_ok=True)

# Card dimensions
CARD_WIDTH = 125
CARD_HEIGHT = 175

# Colors
RED = (220, 20, 60)
BLACK = (40, 40, 40)
WHITE = (255, 255, 255)
BLUE = (30, 60, 140)

suits = {
    'clubs': {'symbol': '♣', 'color': BLACK},
    'diamonds': {'symbol': '♦', 'color': RED},
    'hearts': {'symbol': '♥', 'color': RED},
    'spades': {'symbol': '♠', 'color': BLACK}
}

ranks = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
    'jack': 'J', 'queen': 'Q', 'king': 'K', 'ace': 'A'
}

def create_card(rank, suit):
    # Create image
    img = Image.new('RGB', (CARD_WIDTH, CARD_HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)
    
    # Draw border
    draw.rectangle([2, 2, CARD_WIDTH-3, CARD_HEIGHT-3], outline=BLACK, width=2)
    draw.rectangle([4, 4, CARD_WIDTH-5, CARD_HEIGHT-5], outline=BLACK, width=1)
    
    # Get suit info
    suit_info = suits[suit]
    color = suit_info['color']
    symbol = suit_info['symbol']
    rank_display = ranks[rank]
    
    try:
        # Try to use a reasonable font size
        font_large = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
        font_small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
        font_symbol = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 32)
    except:
        # Fallback to default font
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_symbol = ImageFont.load_default()
    
    # Draw rank in top-left
    draw.text((10, 8), rank_display, fill=color, font=font_large)
    draw.text((10, 32), symbol, fill=color, font=font_small)
    
    # Draw rank in bottom-right (rotated)
    draw.text((CARD_WIDTH-25, CARD_HEIGHT-40), rank_display, fill=color, font=font_large)
    draw.text((CARD_WIDTH-25, CARD_HEIGHT-60), symbol, fill=color, font=font_small)
    
    # Draw center symbol
    center_x = CARD_WIDTH // 2 - 15
    center_y = CARD_HEIGHT // 2 - 15
    draw.text((center_x, center_y), symbol, fill=color, font=font_symbol)
    
    # Save the image
    filename = f'{rank}_of_{suit}.png'
    img.save(filename)
    print(f'Created {filename}')

def create_card_back():
    # Create card back
    img = Image.new('RGB', (CARD_WIDTH, CARD_HEIGHT), BLUE)
    draw = ImageDraw.Draw(img)
    
    # Draw border
    draw.rectangle([2, 2, CARD_WIDTH-3, CARD_HEIGHT-3], outline=WHITE, width=3)
    
    # Draw pattern
    for i in range(5, CARD_WIDTH-5, 10):
        for j in range(5, CARD_HEIGHT-5, 10):
            if (i + j) % 20 == 0:
                draw.rectangle([i, j, i+5, j+5], fill=WHITE)
    
    # Save the image
    img.save('back.png')
    print('Created back.png')

# Create all cards
for suit in suits.keys():
    for rank in ranks.keys():
        create_card(rank, suit)

# Create card back
create_card_back()

print("All cards created!")
