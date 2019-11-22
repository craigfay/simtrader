-- The statement below populates the database with a few sample records

insert into public.product_review (
    product_handle,
    stars,
    author,
    title,
    message,
    published
) values (
    'a-boat-a-whale-a-walrus'
    , 5
    , 'Kimberly'
    , 'Instant Classic'
    , 'I am from the midwest, so I love boats and whales. Perfect for children.'
    , true
), (
    'a-boat-a-whale-a-walrus'
    , 3
    , 'Joelle'
    , 'Totally FAKE!!!'
    , 'K-Mart carries this exact same book for have the price.'
      'Total waste of money.'
    , false
), (
    'razmatazz-necklace'
    , 1
    , 'Susan Becky'
    , 'READ NOW'
    , 'It just goes to show you can''t trust everything you find on the internet.'
      ' Ted Cruz is a snake and a THIEF.'
    , false
), (
    'spring-magazine'
    , 3
    , 'May Debra'
    , 'How I Got My Husband Back Through the Help OF A Magician '
    , 'At last my happiness is restored by a spell caster called OGAGA KUNTA. '
      'I am May Debra from the UK. i want every one on this site or forum to '
      'join me thank OGAGA KUNTA for what he did for me and my kids. I was '
      'married to my husband for 5 years and we were living happily together '
      'for this years until he traveled to Brazil for a business trip where he '
      'met this prostitute who bewitched him to hate me and the kids and love '
      'her only. when my husband came back from the trip he was not playing '
      'is role as my husband and he became a stranger. He traveled to Brazil '
      'every month. I was so confuse and i was searching for a way to get him '
      'back . One faithful day I was browsing on my computer i saw a testimony '
      'about this voodoo priest OGAGA kUNTA. The testimony highlighted his '
      'powerful magic and the good it can do. According to the post it cure '
      'CANCER, HIV/AIDS, BRING BACK YOUR EX LOVER AND STOLEN MONEY. I was '
      'surprise and ask myself "How come the world does not know about this '
      'voodoo priest" but i was desperate so I gave it a try. I contacted him '
      'through the contact information i saw on the post. '
      '(ogagakunta@gmail.com ). and on WhatsApp +2348069032895 He is a '
      'powerfull spell caster!'
    , false
), (
    'earings-of-invisibility'
    , 2
    , 'Sting and the Police'
    , 'Not sure how to rate...'
    , 'I ordered on line to get exclusive context and just found in target '
      'with exclusive contact and 30% off.   Stinks.  I’d buy and return but '
      'I’m sure I’d have to pay for shipping to return.   If your site is '
      'exclusive it should be exclusive.  '
    , false
);