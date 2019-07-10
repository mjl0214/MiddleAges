import ShaderLab from "./ShaderLab";
import ShaderMaterial from "./ShaderMaterial";

export enum ShaderType {
    Default = 0,
    Gray,
    GrayScaling = 100,
    Stone,          // 石化
    Ice,            // 冰
    Frozen,         // 冰冻
    Mirror,
    Poison,
    Banish,
    Vanish,         // 弱化
    Invisible,      // 隐藏
    Blur,           // 模糊
    GaussBlur,      // 高斯模糊
    Dissolve,       // 溶解
    Fluxay,         // 流光 
    FluxaySuper,    // 流光plus
    Outline,        // 描边
    Emboss,         // 浮雕
    Saturation,     // 饱和
    Brightness,     // 高光
    Negative,       // 反色
    Pencil,         // 铅笔
    Mosaic,         // 马赛克
    OldPhoto,       // 旧照片
    SobelEdge,      // 索贝尔边缘检测
    Toon,           // 卡通
    Sharpen,        // 磨砂
    OilPaint,       // 油画
    Mat3Filter,     // 三阶滤波矩阵
    CyberPunk,      // 赛博朋克
    White,          // 纯白
    TestEx,
}

export default class ShaderManager {
    static useShader(sprite: cc.Sprite, shader: ShaderType): ShaderMaterial {
        // if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        //     console.warn('Shader not surpport for canvas');
        //     return;
        // }
        if (!sprite || !sprite.spriteFrame || sprite.getState() === Number(shader)) {
            return;
        }
        if (shader > ShaderType.Gray) {
            let name = ShaderType[shader];
            let lab = ShaderLab[name];
            if (!lab) {
                console.warn('Shader not defined', name);
                return;
            }
            cc.dynamicAtlasManager.enabled = false;
            let material = new ShaderMaterial(name, lab.vert, lab.frag, lab.defines || []);
            let texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            // add
            material.setSize(sprite.spriteFrame.getRect().width, sprite.spriteFrame.getRect().height);
            material.updateHash();
            let sp = sprite as any;
            sp._material = material;
            sp._renderData._material = material;
            sp._state = shader;
            return material;
        }
        else {
            sprite.setState(Number(shader));
        }
    }
}
