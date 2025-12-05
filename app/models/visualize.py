import os
import os.path as osp

import pandas as pd

import altair as alt

import warnings

# UserWarning 중에서 메시지에 'Automatically deduplicated selection parameter'가 포함된 경고 무시
warnings.filterwarnings("ignore", message="Automatically deduplicated selection parameter", category=UserWarning)

def visualize(html_dir, folder_name, model, tokenizer, inputs, preds, n_examples=4):
    if not osp.exists(html_dir):
        os.makedirs(html_dir)

    folder_path = osp.join(html_dir, folder_name)

    if not osp.exists(folder_path):
        os.makedirs(folder_path)

    loop_len = min(inputs.size(0), n_examples)

    results = [()] * loop_len

    for i in range(loop_len):
        # @@@@ 한 문장의 토큰들을 다 합친 결과가 아니라 토큰들이 각 원소로 들어가있어야 함
        decoded_inputs = tokenizer.convert_ids_to_tokens(inputs[i])

        decoded_preds = tokenizer.convert_ids_to_tokens(preds[i])

        # Some simple post-processing
        decoded_inputs = [inp.strip() for inp in decoded_inputs if inp != "<pad>"]
        decoded_preds = [pred.strip() for pred in decoded_preds if pred != "<pad>"]

        print(
            "Source Text (Input)        : "
            + " ".join(decoded_inputs)
        )
        print("Model Output             : " 
              + " ".join(decoded_preds)
        )
        results[i] = (decoded_inputs, preds[i], decoded_preds)


    for j, r in enumerate(results):
        file_name = osp.join(folder_path, f"encoder_self_{j}.html")
        viz_encoder_self(model, r, file_name)
        file_name = osp.join(folder_path, f"decoder_self_{j}.html")
        viz_decoder_self(model, r, file_name)
        file_name = osp.join(folder_path, f"decoder_src_{j}.html")
        viz_decoder_src(model, r, file_name)




def mtx2df(m, max_row, max_col, row_tokens, col_tokens):
    "convert a dense matrix to a data frame with row and column indices"
    return pd.DataFrame(
        [
            (
                r,
                c,
                float(m[r, c]),
                "%.3d %s"
                % (r, row_tokens[r] if len(row_tokens) > r else "<blank>"),
                "%.3d %s"
                % (c, col_tokens[c] if len(col_tokens) > c else "<blank>"),
            )
            for r in range(m.shape[0])
            for c in range(m.shape[1])
            if r < max_row and c < max_col
        ],
        # if float(m[r,c]) != 0 and r < max_row and c < max_col],
        columns=["row", "column", "value", "row_token", "col_token"],
    )


def attn_map(attn, layer, head, row_tokens, col_tokens, max_dim=30):
    df = mtx2df(
        attn[0, head].data, # attn은 (batch, head, q_seq_len, k_seq_len) ==> 지정된 head의 (q_seq_len, k_seq_len) 부분만 추출
        max_dim,
        max_dim,
        row_tokens,
        col_tokens,
    )

    # param = alt.selection_point(name=f'head{head}')

    return (
        alt.Chart(data=df)
        .mark_rect()
        .encode(
            x=alt.X("col_token", axis=alt.Axis(title="")),
            y=alt.Y("row_token", axis=alt.Axis(title="")),
            color="value",
            tooltip=["row", "column", "value", "row_token", "col_token"],
        )
        .properties(height=400, width=400)
        .interactive()
        # .add_params(param)
    )


def get_encoder(model, layer):
    return model.encoder.blocks[layer].MHA.attn


def get_decoder_self(model, layer):
    return model.decoder.blocks[layer].MMHA.attn


def get_decoder_src(model, layer):
    return model.decoder.blocks[layer].MHA.attn

def visualize_layer(model, layer, getter_fn, ntokens, row_tokens, col_tokens):
    # ntokens = last_example[0].ntokens
    attn = getter_fn(model, layer)
    n_heads = attn.shape[1]

    charts = [
        attn_map(
            attn,
            0,
            h,
            row_tokens=row_tokens,
            col_tokens=col_tokens,
            max_dim=ntokens,
        )
        for h in range(n_heads)
    ]
    assert n_heads == 8

    combined_chart = alt.vconcat(
        charts[0]
        # | charts[1]
        | charts[2]
        # | charts[3]
        | charts[4]
        # | charts[5]
        | charts[6]
        # | charts[7]
        # layer + 1 due to 0-indexing
    ).properties(title="Layer %d" % (layer + 1))


    return combined_chart

def viz_encoder_self(model, r, file_name):
    layer_viz = [
        visualize_layer(
            model, layer, get_encoder, len(r[0]), r[0], r[0] # r[0]은 decoded_inputs ==> len(r[0])로 input의 토큰 개수 입력
        )
        for layer in range(6)
    ]

    encoder_self_chart = alt.hconcat(
        layer_viz[0]
        # & layer_viz[1]
        & layer_viz[2]
        # & layer_viz[3]
        & layer_viz[4]
        # & layer_viz[5]
    )


    encoder_self_chart.save(file_name)

def viz_decoder_self(model, r, file_name):
    layer_viz = [
        visualize_layer(
            model,
            layer,
            get_decoder_self,
            len(r[2]),
            r[2],
            r[2],
            # r[2]은 decoded_preds
        )
        for layer in range(6)
    ]

    decoder_self_chart = alt.hconcat(
        layer_viz[0]
        & layer_viz[1]
        & layer_viz[2]
        & layer_viz[3]
        & layer_viz[4]
        & layer_viz[5]
    )

    decoder_self_chart.save(file_name)

def viz_decoder_src(model, r, file_name):
    layer_viz = [
        visualize_layer(
            model,
            layer,
            get_decoder_src,
            max(len(r[0]),len(r[2])),
            r[0],
            r[2],
            # r[0]은 decoded_inputs
            # r[2]은 decoded_preds
        )
        for layer in range(6)
    ]

    decoder_src_chart = alt.hconcat(
        layer_viz[0]
        & layer_viz[1]
        & layer_viz[2]
        & layer_viz[3]
        & layer_viz[4]
        & layer_viz[5]
    )

    decoder_src_chart.save(file_name)

