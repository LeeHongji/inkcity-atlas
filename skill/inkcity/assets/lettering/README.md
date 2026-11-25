# CJK stroke tables

Real characters for signs, lanterns, banners and noren, hand-cut for the inkcity Atlas cities. Each file defines one table: character → strokes in writing order, each stroke a polyline on a 10 × 10 grid (x right, y down). Draw words with the kit: `K.glyphs2` (wide px), `K.glyphsP` / `K.glyphs` (on a plane or a building face), `K.glyphSign` (a board), `K.nobori` (a banner); see references/engine.md §5b.

- Copy the table you need into your scene's `src/` (rename the `const` if it clashes with a name of yours) and load it before the tiles.
- Use only characters that are in the table. To add one, write it in the same style, then render it large next to a system font and check every stroke: a reader of Chinese or Japanese sees a miswritten character at once. Japanese forms differ from Chinese ones (門 / 门, 駅, 気 / 气).
- A key `ch + '|'` is the upright form of a character in vertical text (Japanese ー).

## `hz_beijing.js`: `HZ`, Beijing (simplified Chinese), 33 characters

北 京 天 安 门 地 铁 出 口 胡 同 茶 面 饺 子 烤 鸭 糖 葫 芦 前 大 栅 栏 坛 福 小 吃 王 府 井 煎 饼

## `zh_hongkong.js`: `HK`, Hong Kong (traditional Chinese), 40 characters

香 港 電 車 茶 餐 廳 大 押 酒 家 金 街 市 士 多 天 星 小 輪 中 環 尖 沙 咀 旺 角 海 味 魚 彩 虹 邨 山 頂 望 右 文 武 廟

## `hz_chongqing.js`: `CQH`, Chongqing (simplified Chinese), 36 characters

十 八 口 出 小 天 子 李 坝 站 轻 轨 洪 崖 洞 解 放 碑 火 锅 面 茶 馆 长 江 索 道 朝 门 梯 重 庆 嘉 陵 码 头

## `jp_tokyo.js`: `JP`, Tokyo (Japanese: kanji, katakana, hiragana), 111 characters

電 気 中 古 渋 谷 本 寿 司 焼 鳥 酒 居 屋 喫 茶 甘 味 和 菓 子 食 堂 牛 丼 雷 門 浅 草 祭 大 吉 魚 築 地 東 京 駅 湯 薬 米 肉 花 山 金 天 小 口 出 店 ア イ ウ オ カ キ ク ケ コ サ シ ス セ ソ タ チ テ ト ナ ニ ノ ハ ヒ ホ マ ミ ム メ モ ラ リ ル レ ロ ン ー ー| ゆ そ う ん お た こ や き し す い ガ ゲ ド バ ビ パ プ ば ど で だ ご
