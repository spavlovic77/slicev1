import React from 'react'
import { Table, Icon, Avatar, Tag } from 'web3uikit';

const uitest = () => {
    return (
        <div>
            <Table
  columnsConfig="80px 3fr 2fr 2fr 80px"
  data={[
    [
      <Avatar isRounded theme="image"/>,
      'Moralis Magi',
      <Tag color="blue" text="Nft Collection"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'My Cool Nft',
      <Tag color="red" text="Lazy Nft"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Magi Cool Topen',
      <Tag color="yellow" text="Pack"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'My Marketplace',
      <Tag color="red" text="Nft Marketplace"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Owl Magi',
      <Tag color="purple" text="Bundle"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Owl Nft',
      <Tag color="green" text="Token"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Ape Yacht',
      <Tag color="blue" text="Nft Collection"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Charzard',
      <Tag color="red" text="Bundle"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Magi',
      <Tag color="green" text="Token"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Moralis Magi',
      <Tag color="blue" text="Nft Collection"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'My Cool Nft',
      <Tag color="red" text="Lazy Nft"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ],
    [
      <Avatar isRounded theme="image"/>,
      'Magi Cool Topen',
      <Tag color="yellow" text="Pack"/>,
      '0x18...130e',
      <Icon fill="black" size={32} svg="moreVert"/>
    ]
  ]}
  header={[
    '',
    <span>Name</span>,
    <span>Type</span>,
    <span>Module</span>,
    ''
  ]}
  maxPages={3}
  onPageNumberChanged={function noRefCheck(){}}
  pageSize={5}
/>
        </div>
    )
}

export default uitest
