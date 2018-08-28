declare module 'segment' {
  enum PostTag {
    D_A = 0x40000000, // 形容词 形语素
    D_B = 0x20000000, // 区别词 区别语素
    D_C = 0x10000000, // 连词 连语素
    D_D = 0x08000000, // 副词 副语素
    D_E = 0x04000000, // 叹词 叹语素
    D_F = 0x02000000, // 方位词 方位语素
    D_I = 0x01000000, // 成语
    D_L = 0x00800000, // 习语
    A_M = 0x00400000, // 数词 数语素
    D_MQ = 0x00200000, // 数量词
    D_N = 0x00100000, // 名词 名语素
    D_O = 0x00080000, // 拟声词
    D_P = 0x00040000, // 介词
    A_Q = 0x00020000, // 量词 量语素
    D_R = 0x00010000, // 代词 代语素
    D_S = 0x00008000, // 处所词
    D_T = 0x00004000, // 时间词
    D_U = 0x00002000, // 助词 助语素
    D_V = 0x00001000, // 动词 动语素
    D_W = 0x00000800, // 标点符号
    D_X = 0x00000400, // 非语素字
    D_Y = 0x00000200, // 语气词 语气语素
    D_Z = 0x00000100, // 状态词
    A_NR = 0x00000080, // 人名
    A_NS = 0x00000040, // 地名
    A_NT = 0x00000020, // 机构团体
    A_NX = 0x00000010, // 外文字符
    A_NZ = 0x00000008, // 其他专名
    D_ZH = 0x00000004, // 前接成分
    D_K = 0x00000002, // 后接成分
    UNK = 0x00000000, // 未知词性
    URL = 0x00000001, // 网址、邮箱地址
  }

  export interface SegmentOptions {
    simple: boolean;
    stripPunctuation: boolean;
    convertSynonym: boolean;
    stripStopword: boolean;
  }

  export interface SegmentItem {
    w: string;
    p: PostTag;
  }

  export default class Segment {
    use(module: string | string[] | object): this;

    loadDict(
      name: string,
      type: string = 'TABLE',
      convertToLower?: boolean,
    ): this;

    getDict(): object;

    loadSynonymDict(name: string): this;

    loadStopwordDict(name: string): this;

    useDefault(): this;

    doSegment(text: string, options?: Partial<SegmentOptions>): SegmentItem[];

    toString(words: SegmentItem[]): string;

    split(words: SegmentItem[], s: PostTag | string): SegmentItem[];

    indexOf(
      words: SegmentItem[],
      s: PostTag | string,
      cur?: number,
    ): number | -1;
  }
}
