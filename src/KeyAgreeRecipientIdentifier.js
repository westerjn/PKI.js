import * as asn1js from "asn1js";
import { getParametersValue } from "pvutils";
import IssuerAndSerialNumber from "./IssuerAndSerialNumber.js";
import RecipientKeyIdentifier from "./RecipientKeyIdentifier.js";
//**************************************************************************************
/**
 * Class from RFC5652
 */
export default class KeyAgreeRecipientIdentifier
{
	//**********************************************************************************
	/**
	 * Constructor for KeyAgreeRecipientIdentifier class
	 * @param {Object} [parameters={}]
	 * @property {Object} [schema] asn1js parsed value
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {number}
		 * @description variant
		 */
		this.variant = getParametersValue(parameters, "variant", KeyAgreeRecipientIdentifier.defaultValues("variant"));
		/**
		 * @type {*}
		 * @description values
		 */
		this.value = getParametersValue(parameters, "value", KeyAgreeRecipientIdentifier.defaultValues("value"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "variant":
				return (-1);
			case "value":
				return {};
			default:
				throw new Error(`Invalid member name for KeyAgreeRecipientIdentifier class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "variant":
				return (memberValue === (-1));
			case "value":
				return (Object.keys(memberValue).length === 0);
			default:
				throw new Error(`Invalid member name for KeyAgreeRecipientIdentifier class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of asn1js schema for current class
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		//KeyAgreeRecipientIdentifier ::= CHOICE {
		//    issuerAndSerialNumber IssuerAndSerialNumber,
		//    rKeyId [0] IMPLICIT RecipientKeyIdentifier }

		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [issuerAndSerialNumber]
		 * @property {string} [rKeyId]
		 */
		const names = getParametersValue(parameters, "names", {});

		return (new asn1js.Choice({
			value: [
				IssuerAndSerialNumber.schema(names.issuerAndSerialNumber || {
					names: {
						blockName: (names.blockName || "")
					}
				}),
				new asn1js.Constructed({
					name: (names.blockName || ""),
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 0 // [0]
					},
					value: RecipientKeyIdentifier.schema(names.rKeyId || {
						names: {
							blockName: (names.blockName || "")
						}
					}).valueBlock.value
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Check the schema is valid
		const asn1 = asn1js.compareSchema(schema,
			schema,
			KeyAgreeRecipientIdentifier.schema({
				names: {
					blockName: "blockName"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for KeyAgreeRecipientIdentifier");
		//endregion

		//region Get internal properties from parsed schema
		if(asn1.result.blockName.idBlock.tagClass === 1)
		{
			this.variant = 1;
			this.value = new IssuerAndSerialNumber({ schema: asn1.result.blockName });
		}
		else
		{
			this.variant = 2;

			asn1.result.blockName.idBlock.tagClass = 1; // UNIVERSAL
			asn1.result.blockName.idBlock.tagNumber = 16; // SEQUENCE

			this.value = new RecipientKeyIdentifier({ schema: asn1.result.blockName });
		}
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		switch(this.variant)
		{
			case 1:
				return this.value.toSchema();
			case 2:
				return new asn1js.Constructed({
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 0 // [0]
					},
					value: this.value.toSchema().valueBlock.value
				});
			default:
				return new asn1js.Any();
		}
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const _object = {
			variant: this.variant
		};

		if((this.variant === 1) || (this.variant === 2))
			_object.value = this.value.toJSON();

		return _object;
	}
	//**********************************************************************************
}
//**************************************************************************************
