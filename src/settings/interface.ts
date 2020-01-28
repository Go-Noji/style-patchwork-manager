//スタイルを当てる条件
export interface Coordinate {
  type: 'style' | 'augment' | 'tag',
  key: string,
  values: string | null
}

//CSS スタイル
export interface Style {
  property: string,
  values: string
}

//どの条件でなんのスタイルを当てるか
export interface Define {
  coordinates: Coordinate[],
  styles: Style[]
}

//サイトごとに設定できる Define 集
export interface Preset {
  title: string,
  url: string,
  color: string,
  style: string,
  defines: Define[]
}
